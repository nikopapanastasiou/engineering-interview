import { Test, TestingModule } from '@nestjs/testing';
import { PokemonService } from './pokemon.service';
import { DRIZZLE_CLIENT } from '../database/db.tokens';
import { pokemonTable } from '../database/entities/pokemon.entity';

describe('PokemonService', () => {
  let moduleRef: TestingModule;
  let service: PokemonService;

  const dbMock = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 1 }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    query: {
      pokemonTable: {
        findFirst: jest.fn(),
      },
    },
  } as any;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        PokemonService,
        { provide: DRIZZLE_CLIENT, useValue: dbMock },
      ],
    }).compile();

    service = moduleRef.get(PokemonService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns array', async () => {
    dbMock.from.mockResolvedValueOnce([{ id: 1 }]);
    const res = await service.findAll();
    expect(dbMock.select).toHaveBeenCalled();
    expect(dbMock.from).toHaveBeenCalledWith(pokemonTable);
    expect(res).toEqual([{ id: 1 }]);
  });

  it('findById uses query.findFirst', async () => {
    dbMock.query.pokemonTable.findFirst.mockResolvedValueOnce({ id: 2 });
    const res = await service.findById(2);
    expect(dbMock.query.pokemonTable.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: 2 });
  });

  it('create inserts and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 7 }]);
    const res = await service.create({ id: 7, name: 'squirtle' } as any);
    expect(dbMock.insert).toHaveBeenCalledWith(pokemonTable);
    expect(dbMock.values).toHaveBeenCalled();
    expect(res).toEqual({ id: 7 });
  });

  it('update updates and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 7 }]);
    const res = await service.update(7, { name: 'wartortle' } as any);
    expect(dbMock.update).toHaveBeenCalledWith(pokemonTable);
    expect(dbMock.where).toHaveBeenCalled();
    expect(res).toEqual({ id: 7 });
  });

  it('remove deletes row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 7 }]);
    await service.remove(7);
    expect(dbMock.delete).toHaveBeenCalledWith(pokemonTable);
    expect(dbMock.where).toHaveBeenCalled();
  });
});
