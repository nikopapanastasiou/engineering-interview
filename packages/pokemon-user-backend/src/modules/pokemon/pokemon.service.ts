import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq, count, asc } from 'drizzle-orm';
import { DRIZZLE_CLIENT, DrizzleDatabase } from '../database/db.tokens';
import { pokemonTable, type Pokemon } from '../database/entities/pokemon.entity';
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

}
