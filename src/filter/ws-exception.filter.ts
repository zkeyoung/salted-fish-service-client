import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter } from '@nestjs/websockets';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

@Catch()
export default class CatchUnhandleWsException extends BaseWsExceptionFilter {
  constructor(
    @InjectPinoLogger(CatchUnhandleWsException.name)
    private readonly logger: PinoLogger,
  ) {
    super();
  }

  catch(exception, host: ArgumentsHost) {
    const ws = host.switchToWs();
    const { channel, ...reqData } = ws.getData();
    const ack = host.getArgByIndex(2);
    this.logger.error(
      {
        channel: channel,
        reqData: reqData,
      },
      exception.stack || exception,
    );
    ack(
      exception.response || {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'INTERNAL_SERVER_ERROR',
      },
    );
  }
}
