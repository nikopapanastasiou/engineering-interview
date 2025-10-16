import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { DRIZZLE_CLIENT } from '../database/db.tokens';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('ProfileService', () => {
  let moduleRef: TestingModule;
  let service: ProfileService;
  let dbMock: any;

  const mockProfile = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    passwordHash: '$2b$10$test.hash',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
    mockedBcrypt.hash.mockResolvedValue('$2b$10$hashed.password' as never);
    
    dbMock = {
      select: jest.fn().mockReturnThis(),
      from: jest.fn().mockResolvedValue([mockProfile]),
      insert: jest.fn().mockReturnThis(),
      values: jest.fn().mockReturnThis(),
      returning: jest.fn().mockResolvedValue([mockProfile]),
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      query: {
        profilesTable: {
          findFirst: jest.fn().mockResolvedValue(mockProfile),
        },
      },
    };

    moduleRef = await Test.createTestingModule({
      providers: [
        ProfileService,
        { provide: DRIZZLE_CLIENT, useValue: dbMock },
      ],
    }).compile();

    service = moduleRef.get<ProfileService>(ProfileService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    await moduleRef.close();
  });

  describe('findAll', () => {
    it('should return all profiles', async () => {
      const profiles = [mockProfile];
      dbMock.from.mockResolvedValue(profiles);

      const result = await service.findAll();

      expect(dbMock.select).toHaveBeenCalled();
      expect(dbMock.from).toHaveBeenCalled();
      expect(result).toEqual(profiles);
    });
  });

  describe('findByEmail', () => {
    it('should return profile when found', async () => {
      dbMock.query.profilesTable.findFirst.mockResolvedValue(mockProfile);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockProfile);
      expect(dbMock.query.profilesTable.findFirst).toHaveBeenCalled();
    });

    it('should return null when not found', async () => {
      dbMock.query.profilesTable.findFirst.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should return profile when found', async () => {
      dbMock.query.profilesTable.findFirst.mockResolvedValue(mockProfile);

      const result = await service.findById('user-1');

      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException when not found', async () => {
      dbMock.query.profilesTable.findFirst.mockResolvedValue(null);

      await expect(service.findById('nonexistent')).rejects.toThrow(
        new NotFoundException('Profile nonexistent not found')
      );
    });
  });

  describe('create', () => {
    const newProfile = {
      email: 'new@example.com',
      displayName: 'New User',
      passwordHash: 'hashed',
    };

    it('should create a new profile', async () => {
      dbMock.returning.mockResolvedValue([{ ...newProfile, id: 'new-user' }]);

      const result = await service.create(newProfile);

      expect(dbMock.insert).toHaveBeenCalled();
      expect(dbMock.values).toHaveBeenCalledWith(newProfile);
      expect(result).toEqual({ ...newProfile, id: 'new-user' });
    });
  });

  describe('createWithPassword', () => {
    it('should create profile with hashed password', async () => {
      const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
      const hashedPassword = '$2b$10$hashed.password';
      mockedBcrypt.hash.mockResolvedValue(hashedPassword as never);
      
      const newProfile = {
        id: 'new-user',
        email: 'new@example.com',
        displayName: 'New User',
        passwordHash: hashedPassword,
      };
      dbMock.returning.mockResolvedValue([newProfile]);

      const result = await service.createWithPassword('new@example.com', 'New User', 'password');

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(dbMock.insert).toHaveBeenCalled();
      expect(result).toEqual(newProfile);
    });
  });

  describe('update', () => {
    const updateData = { displayName: 'Updated Name' };

    it('should update existing profile', async () => {
      const updatedProfile = { ...mockProfile, ...updateData };
      dbMock.returning.mockResolvedValue([updatedProfile]);

      const result = await service.update('user-1', updateData);

      expect(dbMock.update).toHaveBeenCalled();
      expect(dbMock.set).toHaveBeenCalledWith(updateData);
      expect(result).toEqual(updatedProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      dbMock.returning.mockResolvedValue([]);

      await expect(service.update('nonexistent', updateData)).rejects.toThrow(
        new NotFoundException('Profile nonexistent not found')
      );
    });
  });

  describe('remove', () => {
    it('should delete existing profile', async () => {
      dbMock.returning.mockResolvedValue([{ id: 'user-1' }]);

      await service.remove('user-1');

      expect(dbMock.delete).toHaveBeenCalled();
      expect(dbMock.where).toHaveBeenCalled();
    });

    it('should throw NotFoundException when profile not found', async () => {
      dbMock.returning.mockResolvedValue([]);

      await expect(service.remove('nonexistent')).rejects.toThrow(
        new NotFoundException('Profile nonexistent not found')
      );
    });
  });

  describe('getProfile', () => {
    it('should return first profile', async () => {
      dbMock.from.mockResolvedValue([mockProfile]);

      const result = await service.getProfile();

      expect(result).toEqual(mockProfile);
    });

    it('should return null when no profiles exist', async () => {
      dbMock.from.mockResolvedValue([]);

      const result = await service.getProfile();

      expect(result).toBeNull();
    });
  });
});
