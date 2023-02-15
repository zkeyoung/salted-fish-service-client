import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export default class WsLoggerInterceptor implements NestInterceptor {
  constructor(
    @InjectPinoLogger(WsLoggerInterceptor.name)
    private readonly logger: PinoLogger,
  ) {}

  intercept(
    executionContext: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ack = executionContext.getArgByIndex(2);
    const ws = executionContext.switchToWs();
    const { channel } = ws.getData();
    return next.handle().pipe(
      tap(() => {
        this.logger.info(
          {
            type: 'ws',
            channel: channel,
          },
          'ok',
        );
        ack({ statusCode: 200, msg: 'success' });
      }),
    );
  }
}
