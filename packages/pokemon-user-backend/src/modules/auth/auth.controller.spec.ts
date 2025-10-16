import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;
  let module: TestingModule;
  
  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
    jest.clearAllMocks();
  });

  afterEach(async () => {
    if (module) {
      await module.close();
    }
  });

  describe('signup', () => {
    const signupDto = {
      email: 'test@example.com',
      displayName: 'Test User',
      password: 'password123',
    };

    it('should create a new user and return access token', async () => {
      const expectedResult = { 
        access_token: 'mock.token',
        user: {
          id: 'user-id',
          email: signupDto.email,
          displayName: signupDto.displayName,
        }
      };
      authService.signup.mockResolvedValue(expectedResult);

      const result = await controller.signup(signupDto);

      expect(authService.signup).toHaveBeenCalledWith(
        signupDto.email,
        signupDto.displayName,
        signupDto.password
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate service errors', async () => {
      const error = new Error('Email already exists');
      authService.signup.mockRejectedValue(error);

      await expect(controller.signup(signupDto)).rejects.toThrow(error);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should authenticate user and return access token', async () => {
      const expectedResult = { 
        access_token: 'mock.token',
        user: {
          id: 'user-id',
          email: loginDto.email,
          displayName: 'Test User',
        }
      };
      authService.login.mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password
      );
      expect(result).toEqual(expectedResult);
    });

    it('should propagate authentication errors', async () => {
      const error = new Error('Invalid credentials');
      authService.login.mockRejectedValue(error);

      await expect(controller.login(loginDto)).rejects.toThrow(error);
    });
  });
});
