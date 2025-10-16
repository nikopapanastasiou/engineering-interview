import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let reflector: jest.Mocked<Reflector>;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as any;
  });

  describe('public route detection', () => {
    it('should detect public routes using reflector', () => {
      reflector.getAllAndOverride.mockReturnValue(true);
      
      const mockHandler = jest.fn();
      const mockClass = jest.fn();
      
      const result = reflector.getAllAndOverride('isPublic', [mockHandler, mockClass]);
      
      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('isPublic', [mockHandler, mockClass]);
    });

    it('should detect protected routes using reflector', () => {
      reflector.getAllAndOverride.mockReturnValue(false);
      
      const mockHandler = jest.fn();
      const mockClass = jest.fn();
      
      const result = reflector.getAllAndOverride('isPublic', [mockHandler, mockClass]);
      
      expect(result).toBe(false);
    });
  });
});
