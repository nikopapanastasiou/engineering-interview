import { Test, TestingModule } from '@nestjs/testing';
import { TeamsService } from './teams.service';
import { DRIZZLE_CLIENT } from '../database/db.tokens';
import { teamsTable } from '../database/entities/team.entity';
import { teamPokemonTable } from '../database/entities/team-pokemon.entity';
import { pokemonTable } from '../database/entities/pokemon.entity';

describe('TeamsService', () => {
  let moduleRef: TestingModule;
  let service: TeamsService;

  const dbMock = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 't1' }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    query: {
      teamsTable: {
        findFirst: jest.fn(),
      },
    },
  } as any;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TeamsService,
        { provide: DRIZZLE_CLIENT, useValue: dbMock },
      ],
    }).compile();

    service = moduleRef.get(TeamsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns array', async () => {
    dbMock.from.mockResolvedValueOnce([{ id: 't1' }]);
    const res = await service.findAll();
    expect(dbMock.select).toHaveBeenCalled();
    expect(dbMock.from).toHaveBeenCalledWith(teamsTable);
    expect(res).toEqual([{ id: 't1' }]);
  });

  it('findById uses query.findFirst', async () => {
    dbMock.query.teamsTable.findFirst.mockResolvedValueOnce({ id: 't1' });
    const res = await service.findById('t1');
    expect(dbMock.query.teamsTable.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: 't1' });
  });

  it('create inserts and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 't2' }]);
    const res = await service.create({ userId: 'u1', name: 'Alpha' } as any);
    expect(dbMock.insert).toHaveBeenCalledWith(teamsTable);
    expect(dbMock.values).toHaveBeenCalled();
    expect(res).toEqual({ id: 't2' });
  });

  it('update updates and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 't1' }]);
    const res = await service.update('t1', { name: 'Beta' });
    expect(dbMock.update).toHaveBeenCalledWith(teamsTable);
    expect(dbMock.where).toHaveBeenCalled();
    expect(res).toEqual({ id: 't1' });
  });

  it('remove deletes row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 't1' }]);
    await service.remove('t1');
    expect(dbMock.delete).toHaveBeenCalledWith(teamsTable);
    expect(dbMock.where).toHaveBeenCalled();
  });

  it('addPokemon inserts into teamPokemonTable', async () => {
    dbMock.returning.mockResolvedValueOnce([{ teamId: 't1', pokemonId: 25 }]);
    const res = await service.addPokemon('t1', 25);
    expect(dbMock.insert).toHaveBeenCalledWith(teamPokemonTable);
    expect(dbMock.values).toHaveBeenCalledWith({ teamId: 't1', pokemonId: 25 });
    expect(res).toEqual({ teamId: 't1', pokemonId: 25 });
  });

  it('roster selects joined rows', async () => {
    dbMock.from.mockResolvedValueOnce([]);
    await service.roster('t1');
    expect(dbMock.select).toHaveBeenCalled();
    expect(dbMock.from).toHaveBeenCalledWith(teamPokemonTable);
    expect(dbMock.innerJoin).toHaveBeenCalled();
  });
});
