import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { PaginatedResponseDto } from '../../common/dto/pagination.dto';

describe('PokemonController', () => {
  let controller: PokemonController;
  let pokemonService: jest.Mocked<PokemonService>;

  const mockPokemon = {
    id: 1,
    name: 'pikachu',
    types: ['electric'],
    sprites: {
      front_default: 'https://example.com/pikachu.png',
    },
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedResponse = new PaginatedResponseDto([mockPokemon], 1, 20, 150);

  const mockPokemonService = {
    findAll: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        { provide: PokemonService, useValue: mockPokemonService },
      ],
    }).compile();

    controller = module.get<PokemonController>(PokemonController);
    pokemonService = module.get(PokemonService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated pokemon list with default parameters', async () => {
      pokemonService.findAll.mockResolvedValue(mockPaginatedResponse as any);
      const query = { page: 1, limit: 20 };

      const result = await controller.findAll(query);

      expect(pokemonService.findAll).toHaveBeenCalledWith(1, 20);
      expect(result).toEqual(mockPaginatedResponse);
    });

    it('should return paginated pokemon list with custom parameters', async () => {
      const customResponse = new PaginatedResponseDto([mockPokemon], 2, 10, 150);
      pokemonService.findAll.mockResolvedValue(customResponse as any);
      const query = { page: 2, limit: 10 };

      const result = await controller.findAll(query);

      expect(pokemonService.findAll).toHaveBeenCalledWith(2, 10);
      expect(result).toEqual(customResponse);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      pokemonService.findAll.mockRejectedValue(error);
      const query = { page: 1, limit: 20 };

      await expect(controller.findAll(query)).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a pokemon by id', async () => {
      pokemonService.findById.mockResolvedValue(mockPokemon as any);

      const result = await controller.findOne('1');

      expect(pokemonService.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockPokemon);
    });

    it('should throw NotFoundException when pokemon not found', async () => {
      const notFoundError = new NotFoundException('Pokemon 999 not found');
      pokemonService.findById.mockRejectedValue(notFoundError);

      await expect(controller.findOne('999')).rejects.toThrow(notFoundError);
    });

    it('should handle string to number conversion', async () => {
      pokemonService.findById.mockResolvedValue(mockPokemon as any);

      await controller.findOne('25');

      expect(pokemonService.findById).toHaveBeenCalledWith(25);
    });

    it('should handle invalid id format', async () => {
      pokemonService.findById.mockRejectedValue(new Error('Invalid ID'));

      await expect(controller.findOne('invalid')).rejects.toThrow();
    });
  });
});
