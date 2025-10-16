import { Test, TestingModule } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;

  beforeEach(async () => {
    process.env.JWT_SECRET = 'test-secret';

    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtStrategy],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe('validate', () => {
    it('should return user payload for valid JWT', async () => {
      const payload = {
        sub: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        iat: 1642694400,
        exp: 1642698000,
      };

      const result = await strategy.validate(payload);

      expect(result).toEqual({
        userId: payload.sub,
        email: payload.email,
        displayName: payload.displayName,
      });
    });

    it('should handle payload without optional fields', async () => {
      const minimalPayload = {
        sub: 'user-1',
        email: 'test@example.com',
      };

      const result = await strategy.validate(minimalPayload as any);

      expect(result).toEqual({
        userId: minimalPayload.sub,
        email: minimalPayload.email,
        displayName: undefined,
      });
    });

    it('should preserve all payload fields', async () => {
      const extendedPayload = {
        sub: 'user-1',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'admin',
        iat: 1642694400,
        exp: 1642698000,
      };

      const result = await strategy.validate(extendedPayload as any);

      expect(result.userId).toBe(extendedPayload.sub);
      expect(result.email).toBe(extendedPayload.email);
      expect(result.displayName).toBe(extendedPayload.displayName);
    });
  });
});
