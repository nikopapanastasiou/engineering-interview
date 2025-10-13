#!/usr/bin/env node
import axios from 'axios';
import pg from 'pg';
const { Pool } = pg;

// Config via env with sensible defaults matching docker-compose.yml
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = Number(process.env.DB_PORT || 5432);
const DB_NAME = process.env.DB_NAME || 'pokemon';
const DB_USER = process.env.DB_USER || 'admin';
const DB_PASSWORD = process.env.DB_PASSWORD || 'admin';

const START = Number(process.env.SEED_START || 1);
const END = Number(process.env.SEED_END || 150); // First 150 (Gen 1)
const RATE_MS = Number(process.env.SEED_RATE_MS || 600); // ~100 req/min to respect PokeAPI
const MAX_RETRIES = Number(process.env.SEED_MAX_RETRIES || 5);

const pool = new Pool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchPokemon(id) {
  let attempt = 0;
  while (true) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`, {
        timeout: 20000,
        headers: { 'User-Agent': 'engineering-interview-seeder/1.0' },
      });
      return res.data;
    } catch (err) {
      attempt++;
      const status = err?.response?.status;
      const wait = status === 429 ? Math.min(30000 * attempt, 120000) : Math.min(2000 * attempt, 10000);
      if (attempt > MAX_RETRIES) throw new Error(`Failed to fetch pokemon ${id} after ${MAX_RETRIES} retries: ${err}`);
      console.warn(`Fetch error for #${id} (status ${status ?? 'n/a'}) retrying in ${wait}ms (attempt ${attempt})...`);
      await sleep(wait);
    }
  }
}

function mapPokemon(data) {
  const sprites = {
    front_default: data.sprites?.front_default ?? null,
    front_shiny: data.sprites?.front_shiny ?? null,
    back_default: data.sprites?.back_default ?? null,
    back_shiny: data.sprites?.back_shiny ?? null,
    official_artwork: data.sprites?.other?.['official-artwork']?.front_default ?? null,
    dream_world: data.sprites?.other?.dream_world?.front_default ?? null,
    home_default: data.sprites?.other?.home?.front_default ?? null,
    home_shiny: data.sprites?.other?.home?.front_shiny ?? null,
  };

  const types = (data.types || []).map((t) => t.type?.name).filter(Boolean);
  const abilities = (data.abilities || []).map((a) => a.ability?.name).filter(Boolean);
  const stats = {};
  for (const s of data.stats || []) {
    const key = s.stat?.name;
    if (key) stats[key] = s.base_stat;
  }

  return {
    id: data.id,
    name: data.name,
    height: data.height ?? null,
    weight: data.weight ?? null,
    base_experience: data.base_experience ?? null,
    types,
    abilities,
    stats,
    sprites,
  };
}

async function upsertPokemon(client, p) {
  const query = `
    INSERT INTO pokemon (id, name, height, weight, base_experience, types, abilities, stats, sprites)
    VALUES ($1, $2, $3, $4, $5, $6::text[], $7::text[], $8::jsonb, $9::jsonb)
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      height = EXCLUDED.height,
      weight = EXCLUDED.weight,
      base_experience = EXCLUDED.base_experience,
      types = EXCLUDED.types,
      abilities = EXCLUDED.abilities,
      stats = EXCLUDED.stats,
      sprites = EXCLUDED.sprites
  `;
  const values = [
    p.id,
    p.name,
    p.height,
    p.weight,
    p.base_experience,
    p.types,
    p.abilities,
    JSON.stringify(p.stats),
    JSON.stringify(p.sprites),
  ];
  await client.query(query, values);
}

async function main() {
  console.log(`Seeding Pokémon ${START}..${END} with rate ~${Math.round(60000 / RATE_MS)} req/min`);
  const client = await pool.connect();
  try {
    for (let id = START; id <= END; id++) {
      const data = await fetchPokemon(id);
      const mapped = mapPokemon(data);
      await upsertPokemon(client, mapped);
      console.log(`Upserted #${id} ${mapped.name}`);
      await sleep(RATE_MS);
    }
  } finally {
    client.release();
    await pool.end();
  }
  console.log('Seeding complete');
}

main().catch(async (err) => {
  console.error(err);
  await pool.end();
  process.exit(1);
});
