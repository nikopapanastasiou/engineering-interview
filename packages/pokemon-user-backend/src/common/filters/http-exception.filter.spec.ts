import { ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AllExceptionsFilter } from './http-exception.filter';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  let mockResponse: any;
  let mockRequest: any;
  let mockArgumentsHost: any;
  let loggerWarnSpy: jest.SpyInstance;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Mock logger methods to prevent NestJS logger issues
    loggerWarnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation();
    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    
    filter = new AllExceptionsFilter();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockRequest = {
      url: '/test',
      method: 'GET',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: jest.fn().mockReturnValue(mockResponse),
        getRequest: jest.fn().mockReturnValue(mockRequest),
      }),
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('catch', () => {
    it('should handle HttpException with custom message', () => {
      const exception = new HttpException('Custom error message', HttpStatus.BAD_REQUEST);
      const mockResponse = mockArgumentsHost.switchToHttp().getResponse();
      const mockRequest = mockArgumentsHost.switchToHttp().getRequest();

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: expect.any(String),
        path: '/test',
        method: 'GET',
        message: 'Custom error message',
        error: 'HttpException',
      });
    });

    it('should handle HttpException with object response', () => {
      const customResponse = {
        error: 'Validation failed',
        message: ['field1 is required', 'field2 must be a string'],
      };
      const exception = new HttpException(customResponse, HttpStatus.UNPROCESSABLE_ENTITY);
      const mockResponse = mockArgumentsHost.switchToHttp().getResponse();

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(mockResponse.json).toHaveBeenCalledWith({
        statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        timestamp: expect.any(String),
        path: '/test',
        method: 'GET',
        ...customResponse,
      });
    });

    it('should handle 500 Internal Server Error', () => {
      const exception = new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
      const mockResponse = mockArgumentsHost.switchToHttp().getResponse();

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Internal server error',
        })
      );
    });

    it('should include timestamp in ISO format', () => {
      const exception = new HttpException('Test error', HttpStatus.NOT_FOUND);
      const mockResponse = mockArgumentsHost.switchToHttp().getResponse();

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          timestamp: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/),
        })
      );
    });

    it('should handle different request paths', () => {
      const exception = new HttpException('Not found', HttpStatus.NOT_FOUND);
      const mockResponse = mockArgumentsHost.switchToHttp().getResponse();
      
      // Change the request URL
      const mockRequest = { url: '/api/users/123', method: 'GET' };
      mockArgumentsHost.switchToHttp().getRequest = jest.fn().mockReturnValue(mockRequest);

      filter.catch(exception, mockArgumentsHost);

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          path: '/api/users/123',
        })
      );
    });
  });
});
