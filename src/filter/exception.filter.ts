import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import http from 'node:http';

@Catch()
export default class CatchUnhandleException implements ExceptionFilter {
  catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request & { $error: typeof exception }>();
    const response = ctx.getResponse<Response>();

    request.$error = exception;

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
    } else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: http.STATUS_CODES[HttpStatus.INTERNAL_SERVER_ERROR],
      });
    }
  }
}
