import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { and, eq, count, asc } from 'drizzle-orm';
import { DRIZZLE_CLIENT, DrizzleDatabase } from '../database/db.tokens';
import { pokemonTable, type NewPokemon, type Pokemon } from '../database/entities/pokemon.entity';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

@Injectable()
export class PokemonService {
  constructor(@Inject(DRIZZLE_CLIENT) private readonly db: DrizzleDatabase) {}

  async findAll(page: number = 1, limit: number = 20): Promise<PaginatedResponseDto<Pokemon>> {
    const offset = (page - 1) * limit;
    
    const [data, totalResult] = await Promise.all([
      this.db.select().from(pokemonTable).orderBy(asc(pokemonTable.id)).limit(limit).offset(offset),
      this.db.select({ count: count() }).from(pokemonTable),
    ]);
    
    const total = totalResult[0]?.count || 0;
    return new PaginatedResponseDto(data, page, limit, total);
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
