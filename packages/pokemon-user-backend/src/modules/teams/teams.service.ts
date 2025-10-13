import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_CLIENT, DrizzleDatabase } from '../database/db.tokens';
import { teamsTable, type NewTeam, type Team } from '../database/entities/team.entity';
import { teamPokemonTable } from '../database/entities/team-pokemon.entity';
import { pokemonTable } from '../database/entities/pokemon.entity';

@Injectable()
export class TeamsService {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly db: DrizzleDatabase) {}

  findAll(): Promise<Team[]> {
    return this.db.select().from(teamsTable);
  }

  findAllByUser(userId: string): Promise<Team[]> {
    return this.db.select().from(teamsTable).where(eq(teamsTable.userId, userId));
  }

  async findById(id: string): Promise<Team> {
    const team = await this.db.query.teamsTable.findFirst({
      where: eq(teamsTable.id, id),
    });
    if (!team) throw new NotFoundException(`Team ${id} not found`);
    return team;
  }

  async create(payload: NewTeam): Promise<Team> {
    const [created] = await this.db.insert(teamsTable).values(payload).returning();
    return created;
  }

  async update(id: string, payload: Partial<NewTeam>): Promise<Team> {
    const [updated] = await this.db
      .update(teamsTable)
      .set(payload)
      .where(eq(teamsTable.id, id))
      .returning();
    if (!updated) throw new NotFoundException(`Team ${id} not found`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.db
      .delete(teamsTable)
      .where(eq(teamsTable.id, id))
      .returning({ id: teamsTable.id });
    if (deleted.length === 0) throw new NotFoundException(`Team ${id} not found`);
  }

  async addPokemon(teamId: string, pokemonId: number) {
    const [created] = await this.db
      .insert(teamPokemonTable)
      .values({ teamId, pokemonId })
      .returning();
    return created;
  }

  async removePokemon(teamId: string, pokemonId: number) {
    const deleted = await this.db
      .delete(teamPokemonTable)
      .where(and(eq(teamPokemonTable.teamId, teamId), eq(teamPokemonTable.pokemonId, pokemonId)))
      .returning({ teamId: teamPokemonTable.teamId, pokemonId: teamPokemonTable.pokemonId });
    if (deleted.length === 0) {
      throw new NotFoundException(`Pokemon ${pokemonId} not in team ${teamId}`);
    }
  }

  roster(teamId: string) {
    return this.db
      .select({
        teamId: teamPokemonTable.teamId,
        pokemonId: teamPokemonTable.pokemonId,
        pokemon: pokemonTable,
      })
      .from(teamPokemonTable)
      .innerJoin(pokemonTable, eq(teamPokemonTable.pokemonId, pokemonTable.id))
      .where(eq(teamPokemonTable.teamId, teamId));
  }
}
