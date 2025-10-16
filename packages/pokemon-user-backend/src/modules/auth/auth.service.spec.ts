import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ProfileService } from '../profile/profile.service';

jest.mock('bcrypt');
const mockBcrypt = require('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let profileService: jest.Mocked<ProfileService>;
  let jwtService: jest.Mocked<JwtService>;

  const mockProfile = {
    id: 'user-1',
    email: 'test@example.com',
    displayName: 'Test User',
    passwordHash: '$2b$10$mock.hash.password123',
  };

  const profileServiceMock = {
    createWithPassword: jest.fn(),
    findByEmail: jest.fn(),
  };

  const jwtServiceMock = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    mockBcrypt.compare.mockResolvedValue(true as never);
    mockBcrypt.hash.mockResolvedValue('$2b$10$hashed.password' as never);
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ProfileService, useValue: profileServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    profileService = module.get(ProfileService);
    jwtService = module.get(JwtService);
  });

  describe('signup', () => {
    it('should create a new user and return access token', async () => {
      const newUser = {
        id: 'new-user',
        email: 'new@example.com',
        displayName: 'New User',
      };

      profileService.createWithPassword.mockResolvedValue(newUser as any);
      jwtService.signAsync.mockResolvedValue('mock.access.token');

      const result = await service.signup('new@example.com', 'New User', 'password123');

      expect(profileService.createWithPassword).toHaveBeenCalledWith(
        'new@example.com',
        'New User', 
        'password123'
      );
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
      });
      expect(result).toEqual({ access_token: 'mock.access.token' });
    });

    it('should propagate errors from profile service', async () => {
      const error = new Error('Email already exists');
      profileService.createWithPassword.mockRejectedValue(error);

      await expect(
        service.signup('existing@example.com', 'User', 'password')
      ).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    it('should authenticate user and return access token', async () => {
      const expectedToken = { access_token: 'mock.jwt.token' };
      profileService.findByEmail.mockResolvedValue(mockProfile as any);
      mockBcrypt.compare.mockResolvedValue(true as never);
      jwtService.signAsync.mockResolvedValue('mock.jwt.token');

      const result = await service.login('test@example.com', 'password123');

      expect(profileService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockBcrypt.compare).toHaveBeenCalledWith('password123', mockProfile.passwordHash);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: mockProfile.id,
        email: mockProfile.email,
        displayName: mockProfile.displayName,
      });
      expect(result).toEqual(expectedToken);
    });

    it('should throw UnauthorizedException when user not found', async () => {
      profileService.findByEmail.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@example.com', 'password')
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      profileService.findByEmail.mockResolvedValue(mockProfile as any);
      mockBcrypt.compare.mockResolvedValue(false as never);

      await expect(
        service.login('test@example.com', 'wrongpassword')
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));

      expect(mockBcrypt.compare).toHaveBeenCalledWith('wrongpassword', mockProfile.passwordHash);
      expect(jwtService.signAsync).not.toHaveBeenCalled();
    });

    it('should handle bcrypt comparison errors', async () => {
      profileService.findByEmail.mockResolvedValue(mockProfile as any);
      mockBcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));

      await expect(
        service.login('test@example.com', 'password')
      ).rejects.toThrow('Bcrypt error');
    });
  });

  describe('issueToken (private method via public methods)', () => {
    it('should create JWT with correct payload structure', async () => {
      const newUser = {
        id: 'test-user',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      profileService.createWithPassword.mockResolvedValue(newUser as any);
      jwtService.signAsync.mockResolvedValue('mock.token');

      await service.signup('test@example.com', 'Test User', 'password');

      expect(jwtService.signAsync).toHaveBeenCalledWith({
        sub: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
      });
    });

    it('should handle JWT signing errors', async () => {
      const newUser = {
        id: 'test-user',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      profileService.createWithPassword.mockResolvedValue(newUser as any);
      jwtService.signAsync.mockRejectedValue(new Error('JWT signing failed'));

      await expect(
        service.signup('test@example.com', 'Test User', 'password')
      ).rejects.toThrow('JWT signing failed');
    });
  });
});
