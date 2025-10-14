import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

export interface ErrorResponse {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string | string[];
  error?: string;
  details?: any;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const { status, message, error, details } = this.getErrorDetails(exception);

    const errorResponse: ErrorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message,
      ...(error && { error }),
      ...(details && { details }),
    };

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url}`,
        exception instanceof Error ? exception.stack : exception,
      );
    } else {
      this.logger.warn(`${request.method} ${request.url} - ${message}`);
    }

    response.status(status).json(errorResponse);
  }

  private getErrorDetails(exception: unknown): {
    status: number;
    message: string | string[];
    error?: string;
    details?: any;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'object' && response !== null) {
        const responseObj = response as any;
        return {
          status,
          message: responseObj.message || exception.message,
          error: responseObj.error || exception.name,
          details: responseObj.details,
        };
      }

      return {
        status,
        message: exception.message,
        error: exception.name,
      };
    }

    if (exception instanceof Error && exception.name === 'ValidationError') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Validation failed',
        error: 'ValidationError',
        details: exception.message,
      };
    }

    if (exception instanceof Error && exception.message.includes('duplicate key')) {
      return {
        status: HttpStatus.CONFLICT,
        message: 'Resource already exists',
        error: 'ConflictError',
      };
    }

    if (exception instanceof Error && exception.message.includes('foreign key')) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Invalid reference to related resource',
        error: 'ReferenceError',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      error: 'InternalServerError',
      details: exception instanceof Error ? exception.message : 'Unknown error',
    };
  }
}
