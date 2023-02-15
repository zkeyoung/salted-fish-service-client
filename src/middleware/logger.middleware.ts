import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Injectable()
export default class LoggerMiddleware implements NestMiddleware {
  constructor(
    @InjectPinoLogger(LoggerMiddleware.name)
    private readonly logger: PinoLogger,
  ) {}

  use(
    req: Request & { $error?: any },
    res: Response,
    next: (error?: any) => void,
  ) {
    const consume = Date.now();
    res.on('finish', () => {
      const commonLogInfo = {
        consume,
        ip: req.ip,
        endpoint: `${req.method} ${req.baseUrl}${req.path}`,
      };
      if (req.$error) {
        const response = req.$error?.response;
        const level =
          response && response.statusCode === HttpStatus.INTERNAL_SERVER_ERROR
            ? 'error'
            : 'warn';
        this.logger[level](
          Object.assign(
            commonLogInfo,
            {
              headers: {
                contentType: req.headers['content-type'],
              },
              query: req.query,
              body: req.body,
            },
            response && { response: response },
          ),
          response ? req.$error.message : req.$error.stack,
        );
      } else {
        this.logger.info(commonLogInfo, 'ok');
      }
    });
    next();
  }
}
