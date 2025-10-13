import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ProfileService } from '../profile/profile.service';

describe('AuthService (Jest + Nest TestingModule)', () => {
  let moduleRef: TestingModule;
  let service: AuthService;
  let profileService: ProfileService;

  const profileServiceMock = {
    getProfile: jest.fn(),
  } satisfies Partial<ProfileService> as ProfileService;

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ProfileService, useValue: profileServiceMock },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    profileService = moduleRef.get(ProfileService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(profileService).toBeDefined();
  });

  it('validateUser delegates to ProfileService.getProfile', async () => {
    (profileService.getProfile as jest.Mock).mockResolvedValue({ id: '1' });

    const result = await service.validateUser('u', 'p');

    expect(profileService.getProfile).toHaveBeenCalled();
    expect(result).toEqual({ id: '1' });
  });
});
