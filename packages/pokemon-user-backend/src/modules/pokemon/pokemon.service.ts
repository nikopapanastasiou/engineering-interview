import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DRIZZLE_CLIENT, DrizzleDatabase } from '../database/db.tokens';
import { pokemonTable, type NewPokemon, type Pokemon } from '../database/entities/pokemon.entity';

@Injectable()
export class PokemonService {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly db: DrizzleDatabase) {}

  findAll(): Promise<Pokemon[]> {
    return this.db.select().from(pokemonTable);
  }

  async findById(id: number): Promise<Pokemon> {
    const poke = await this.db.query.pokemonTable.findFirst({
      where: eq(pokemonTable.id, id),
    });
    if (!poke) throw new NotFoundException(`Pokemon ${id} not found`);
    return poke;
  }

  async create(payload: NewPokemon): Promise<Pokemon> {
    const [created] = await this.db.insert(pokemonTable).values(payload).returning();
    return created;
  }

  async update(id: number, payload: Partial<NewPokemon>): Promise<Pokemon> {
    const [updated] = await this.db
      .update(pokemonTable)
      .set(payload)
      .where(eq(pokemonTable.id, id))
      .returning();
    if (!updated) throw new NotFoundException(`Pokemon ${id} not found`);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const deleted = await this.db
      .delete(pokemonTable)
      .where(eq(pokemonTable.id, id))
      .returning({ id: pokemonTable.id });
    if (deleted.length === 0) throw new NotFoundException(`Pokemon ${id} not found`);
  }
}
