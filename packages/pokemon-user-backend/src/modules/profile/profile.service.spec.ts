import { Test, TestingModule } from '@nestjs/testing';
import { ProfileService } from './profile.service';
import { DRIZZLE_CLIENT } from '../database/db.tokens';
import { profilesTable } from '../database/entities/profile.entity';
import { eq } from 'drizzle-orm';

describe('ProfileService', () => {
  let moduleRef: TestingModule;
  let service: ProfileService;

  const dbMock = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockResolvedValue([]),
    insert: jest.fn().mockReturnThis(),
    values: jest.fn().mockReturnThis(),
    returning: jest.fn().mockResolvedValue([{ id: 'x' }]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    query: {
      profilesTable: {
        findFirst: jest.fn(),
      },
    },
  } as any;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: DRIZZLE_CLIENT, useValue: dbMock },
      ],
    }).compile();

    service = moduleRef.get(ProfileService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll returns array', async () => {
    dbMock.from.mockResolvedValueOnce([{ id: '1' }]);
    const res = await service.findAll();
    expect(dbMock.select).toHaveBeenCalled();
    expect(dbMock.from).toHaveBeenCalledWith(profilesTable);
    expect(res).toEqual([{ id: '1' }]);
  });

  it('findById uses query.findFirst', async () => {
    dbMock.query.profilesTable.findFirst.mockResolvedValueOnce({ id: '1' });
    const res = await service.findById('1');
    expect(dbMock.query.profilesTable.findFirst).toHaveBeenCalled();
    expect(res).toEqual({ id: '1' });
  });

  it('create inserts and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 'new' }]);
    const res = await service.create({ email: 'a@b.com', displayName: 'A', passwordHash: 'hash' });
    expect(dbMock.insert).toHaveBeenCalledWith(profilesTable);
    expect(dbMock.values).toHaveBeenCalled();
    expect(res).toEqual({ id: 'new' });
  });

  it('update updates and returns row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: 'u' }]);
    const res = await service.update('1', { displayName: 'B' });
    expect(dbMock.update).toHaveBeenCalledWith(profilesTable);
    expect(dbMock.where).toHaveBeenCalled();
    expect(res).toEqual({ id: 'u' });
  });

  it('remove deletes row', async () => {
    dbMock.returning.mockResolvedValueOnce([{ id: '1' }]);
    await service.remove('1');
    expect(dbMock.delete).toHaveBeenCalledWith(profilesTable);
    expect(dbMock.where).toHaveBeenCalled();
  });
});
