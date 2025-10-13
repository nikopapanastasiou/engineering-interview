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

async function fetchWithRetry(url, id) {
  let attempt = 0;
  while (true) {
    try {
      const res = await axios.get(url, {
        timeout: 20000,
        headers: { 'User-Agent': 'engineering-interview-seeder/1.0' },
      });
      return res.data;
    } catch (err) {
      attempt++;
      const status = err?.response?.status;
      const wait = status === 429 ? Math.min(30000 * attempt, 120000) : Math.min(2000 * attempt, 10000);
      if (attempt > MAX_RETRIES) throw new Error(`Failed to fetch ${url} for #${id} after ${MAX_RETRIES} retries: ${err}`);
      console.warn(`Fetch error for #${id} (status ${status ?? 'n/a'}) retrying in ${wait}ms (attempt ${attempt})...`);
      await sleep(wait);
    }
  }
}

async function fetchPokemon(id) {
  return fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${id}`, id);
}

async function fetchSpecies(id) {
  return fetchWithRetry(`https://pokeapi.co/api/v2/pokemon-species/${id}`, id);
}

function mapPokemon(pokemonData, speciesData) {
  const sprites = {
    front_default: pokemonData.sprites?.front_default ?? null,
    front_shiny: pokemonData.sprites?.front_shiny ?? null,
    back_default: pokemonData.sprites?.back_default ?? null,
    back_shiny: pokemonData.sprites?.back_shiny ?? null,
    official_artwork: pokemonData.sprites?.other?.['official-artwork']?.front_default ?? null,
    dream_world: pokemonData.sprites?.other?.dream_world?.front_default ?? null,
    home_default: pokemonData.sprites?.other?.home?.front_default ?? null,
    home_shiny: pokemonData.sprites?.other?.home?.front_shiny ?? null,
  };

  const types = (pokemonData.types || []).map((t) => t.type?.name).filter(Boolean);
  const abilities = (pokemonData.abilities || []).map((a) => a.ability?.name).filter(Boolean);
  const stats = {};
  for (const s of pokemonData.stats || []) {
    const key = s.stat?.name;
    if (key) stats[key] = s.base_stat;
  }

  // Extract English description (flavor text)
  const englishFlavorTexts = (speciesData?.flavor_text_entries || [])
    .filter((entry) => entry.language?.name === 'en')
    .map((entry) => entry.flavor_text?.replace(/\f/g, ' ').replace(/\n/g, ' ').trim());
  const description = englishFlavorTexts[0] || null;

  // Extract English genus (e.g., "Seed Pokémon")
  const englishGenus = (speciesData?.genera || [])
    .find((g) => g.language?.name === 'en')?.genus || null;

  // Extract evolution chain ID
  const evolutionChainUrl = speciesData?.evolution_chain?.url;
  const evolutionChainId = evolutionChainUrl
    ? parseInt(evolutionChainUrl.split('/').filter(Boolean).pop())
    : null;

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    height: pokemonData.height ?? null,
    weight: pokemonData.weight ?? null,
    base_experience: pokemonData.base_experience ?? null,
    types,
    abilities,
    stats,
    sprites,
    
    // Species data
    description,
    genus: englishGenus,
    generation: speciesData?.generation?.name || null,
    habitat: speciesData?.habitat?.name || null,
    shape: speciesData?.shape?.name || null,
    color: speciesData?.color?.name || null,
    is_legendary: speciesData?.is_legendary || false,
    is_mythical: speciesData?.is_mythical || false,
    evolution_chain_id: evolutionChainId,
    capture_rate: speciesData?.capture_rate ?? null,
    base_happiness: speciesData?.base_happiness ?? null,
    growth_rate: speciesData?.growth_rate?.name || null,
  };
}

async function upsertPokemon(client, p) {
  const query = `
    INSERT INTO pokemon (
      id, name, height, weight, base_experience, types, abilities, stats, sprites,
      description, genus, generation, habitat, shape, color,
      is_legendary, is_mythical, evolution_chain_id, capture_rate, base_happiness, growth_rate
    )
    VALUES (
      $1, $2, $3, $4, $5, $6::text[], $7::text[], $8::jsonb, $9::jsonb,
      $10, $11, $12, $13, $14, $15,
      $16, $17, $18, $19, $20, $21
    )
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      height = EXCLUDED.height,
      weight = EXCLUDED.weight,
      base_experience = EXCLUDED.base_experience,
      types = EXCLUDED.types,
      abilities = EXCLUDED.abilities,
      stats = EXCLUDED.stats,
      sprites = EXCLUDED.sprites,
      description = EXCLUDED.description,
      genus = EXCLUDED.genus,
      generation = EXCLUDED.generation,
      habitat = EXCLUDED.habitat,
      shape = EXCLUDED.shape,
      color = EXCLUDED.color,
      is_legendary = EXCLUDED.is_legendary,
      is_mythical = EXCLUDED.is_mythical,
      evolution_chain_id = EXCLUDED.evolution_chain_id,
      capture_rate = EXCLUDED.capture_rate,
      base_happiness = EXCLUDED.base_happiness,
      growth_rate = EXCLUDED.growth_rate
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
    p.description,
    p.genus,
    p.generation,
    p.habitat,
    p.shape,
    p.color,
    p.is_legendary,
    p.is_mythical,
    p.evolution_chain_id,
    p.capture_rate,
    p.base_happiness,
    p.growth_rate,
  ];
  await client.query(query, values);
}

async function main() {
  console.log(`Seeding Pokémon ${START}..${END} with rate ~${Math.round(60000 / RATE_MS)} req/min`);
  const client = await pool.connect();
  try {
    for (let id = START; id <= END; id++) {
      const pokemonData = await fetchPokemon(id);
      await sleep(RATE_MS); // Rate limit between requests
      
      const speciesData = await fetchSpecies(id);
      const mapped = mapPokemon(pokemonData, speciesData);
      await upsertPokemon(client, mapped);
      
      const legendary = mapped.is_legendary ? ' ⭐ LEGENDARY' : '';
      const mythical = mapped.is_mythical ? ' ✨ MYTHICAL' : '';
      console.log(`Upserted #${id} ${mapped.name} (${mapped.genus})${legendary}${mythical}`);
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
