import { integer, jsonb, pgTable, text, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const pokemonTable = pgTable('pokemon', {
  id: integer('id').primaryKey(),
  name: text('name').notNull(),
  height: integer('height'),
  weight: integer('weight'),
  baseExperience: integer('base_experience'),
  types: text('types')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  abilities: text('abilities')
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  stats: jsonb('stats'),
  sprites: jsonb('sprites'),
  description: text('description'),
  genus: text('genus'),
  generation: text('generation'),
  habitat: text('habitat'),
  shape: text('shape'),
  color: text('color'),
  isLegendary: boolean('is_legendary').default(false),
  isMythical: boolean('is_mythical').default(false),
  evolutionChainId: integer('evolution_chain_id'),
  captureRate: integer('capture_rate'),
  baseHappiness: integer('base_happiness'),
  growthRate: text('growth_rate'),
});

export type Pokemon = typeof pokemonTable.$inferSelect;
export type NewPokemon = typeof pokemonTable.$inferInsert;
