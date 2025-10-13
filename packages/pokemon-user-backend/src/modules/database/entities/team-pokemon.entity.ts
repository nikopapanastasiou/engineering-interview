import { integer, pgTable, primaryKey, uuid } from 'drizzle-orm/pg-core';
import { teamsTable } from './team.entity';
import { pokemonTable } from './pokemon.entity';

export const teamPokemonTable = pgTable(
  'team_pokemon',
  {
    teamId: uuid('team_id')
      .notNull()
      .references(() => teamsTable.id, { onDelete: 'cascade' }),
    pokemonId: integer('pokemon_id')
      .notNull()
      .references(() => pokemonTable.id, { onDelete: 'restrict' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.teamId, table.pokemonId], name: 'team_pokemon_pk' }),
  })
);

export type TeamPokemon = typeof teamPokemonTable.$inferSelect;
export type NewTeamPokemon = typeof teamPokemonTable.$inferInsert;
