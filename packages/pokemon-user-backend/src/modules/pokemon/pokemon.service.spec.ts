import { NotFoundException } from '@nestjs/common';
import { DeepMockProxy } from 'jest-mock-extended';
import { PokemonService } from './pokemon.service';
import { DrizzleDatabase } from '../database/db.tokens';
import { createMockDrizzleDb } from '../../test/mocks/drizzle.mock';
import { createMockPokemon } from '../../test/fixtures/pokemon.fixtures';

describe('PokemonService', () => {
  let service: PokemonService;
  let mockDb: DeepMockProxy<DrizzleDatabase>;

  const mockPokemon = createMockPokemon();

  beforeEach(() => {
    mockDb = createMockDrizzleDb();
    service = new PokemonService(mockDb);
  });

  describe('findById', () => {
    it('should return pokemon when found', async () => {
      mockDb.query.pokemonTable.findFirst.mockResolvedValue(mockPokemon as any);

      const result = await service.findById(1);

      expect(result).toEqual(mockPokemon);
      expect(mockDb.query.pokemonTable.findFirst).toHaveBeenCalled();
    });

    it('should throw NotFoundException when Pokemon not found', async () => {
      mockDb.query.pokemonTable.findFirst.mockResolvedValue(undefined);

      await expect(service.findById(999)).rejects.toThrow(
        new NotFoundException('Pokemon 999 not found')
      );
    });
  });
});
