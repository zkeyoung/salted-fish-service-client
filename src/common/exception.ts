import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrMsg } from './error';

export default class SaltedException extends HttpException {
  constructor(
    statusCode: number,
    errMsgOrHttpStatus: string | number = ErrMsg[statusCode],
    httpStatus: number = HttpStatus.BAD_REQUEST,
  ) {
    if (typeof errMsgOrHttpStatus === 'number') {
      httpStatus = errMsgOrHttpStatus;
      super(
        { statusCode: statusCode, message: ErrMsg[statusCode] },
        httpStatus,
      );
    } else {
      const errMsg = errMsgOrHttpStatus;
      super({ statusCode: statusCode, message: errMsg }, httpStatus);
    }
  }
}
