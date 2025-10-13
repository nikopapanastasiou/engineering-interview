import { relations } from 'drizzle-orm';

import { profilesTable } from './profile.entity';
import { pokemonTable } from './pokemon.entity';
import { teamsTable } from './team.entity';
import { teamPokemonTable } from './team-pokemon.entity';

export const profilesRelations = relations(profilesTable, ({ many }) => ({
  teams: many(teamsTable),
}));

export const teamsRelations = relations(teamsTable, ({ one, many }) => ({
  user: one(profilesTable, {
    fields: [teamsTable.userId],
    references: [profilesTable.id],
  }),
  roster: many(teamPokemonTable),
}));

export const teamPokemonRelations = relations(teamPokemonTable, ({ one }) => ({
  team: one(teamsTable, {
    fields: [teamPokemonTable.teamId],
    references: [teamsTable.id],
  }),
  pokemon: one(pokemonTable, {
    fields: [teamPokemonTable.pokemonId],
    references: [pokemonTable.id],
  }),
}));

export const pokemonRelations = relations(pokemonTable, ({ many }) => ({
  teamEntries: many(teamPokemonTable),
}));

export {
  profilesTable,
  pokemonTable,
  teamsTable,
  teamPokemonTable,
};
