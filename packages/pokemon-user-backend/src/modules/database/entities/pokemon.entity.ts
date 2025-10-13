import { integer, jsonb, pgTable, text } from 'drizzle-orm/pg-core';
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
});

export type Pokemon = typeof pokemonTable.$inferSelect;
export type NewPokemon = typeof pokemonTable.$inferInsert;
