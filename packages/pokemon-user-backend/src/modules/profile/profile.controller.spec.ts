import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

describe('ProfileController', () => {
  let controller: ProfileController;
  let profileService: jest.Mocked<ProfileService>;

  const mockProfile = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    passwordHash: '$2b$10$test.hash',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  };

  const mockProfileService = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        { provide: ProfileService, useValue: mockProfileService },
      ],
    }).compile();

    controller = module.get<ProfileController>(ProfileController);
    profileService = module.get(ProfileService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all profiles', async () => {
      const profiles = [mockProfile];
      profileService.findAll.mockResolvedValue(profiles);

      const result = await controller.findAll();

      expect(profileService.findAll).toHaveBeenCalled();
      expect(result).toEqual(profiles);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      profileService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('findOne', () => {
    it('should return a profile by id', async () => {
      profileService.findById.mockResolvedValue(mockProfile);

      const result = await controller.findOne('user-1');

      expect(profileService.findById).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(mockProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      const notFoundError = new NotFoundException('Profile not found');
      profileService.findById.mockRejectedValue(notFoundError);

      await expect(controller.findOne('nonexistent')).rejects.toThrow(notFoundError);
    });
  });

  describe('create', () => {
    const createProfileDto = {
      email: 'new@example.com',
      displayName: 'New User',
      passwordHash: 'hashed',
    };

    it('should create a new profile', async () => {
      const createdProfile = { ...createProfileDto, id: 'new-user' };
      profileService.create.mockResolvedValue(createdProfile as any);

      const result = await controller.create(createProfileDto);

      expect(profileService.create).toHaveBeenCalledWith(createProfileDto);
      expect(result).toEqual(createdProfile);
    });

    it('should handle creation errors', async () => {
      const error = new Error('Email already exists');
      profileService.create.mockRejectedValue(error);

      await expect(controller.create(createProfileDto)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const updateProfileDto = {
      displayName: 'Updated Name',
    };

    it('should update an existing profile', async () => {
      const updatedProfile = { ...mockProfile, ...updateProfileDto };
      profileService.update.mockResolvedValue(updatedProfile);

      const result = await controller.update('user-1', updateProfileDto);

      expect(profileService.update).toHaveBeenCalledWith('user-1', updateProfileDto);
      expect(result).toEqual(updatedProfile);
    });

    it('should throw NotFoundException when profile not found', async () => {
      const notFoundError = new NotFoundException('Profile not found');
      profileService.update.mockRejectedValue(notFoundError);

      await expect(controller.update('nonexistent', updateProfileDto)).rejects.toThrow(notFoundError);
    });
  });

  describe('remove', () => {
    it('should remove a profile', async () => {
      profileService.remove.mockResolvedValue(undefined);

      await controller.remove('user-1');

      expect(profileService.remove).toHaveBeenCalledWith('user-1');
    });

    it('should throw NotFoundException when profile not found', async () => {
      const notFoundError = new NotFoundException('Profile not found');
      profileService.remove.mockRejectedValue(notFoundError);

      await expect(controller.remove('nonexistent')).rejects.toThrow(notFoundError);
    });
  });
});
