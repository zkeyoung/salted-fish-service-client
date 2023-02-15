import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import User from '../modules/orm/entities/user';

export const ReqUser = createParamDecorator<string>(
  (data: string, executionContext: ExecutionContext) => {
    const ctx = executionContext.switchToHttp();
    const user = ctx.getRequest().user;
    return data ? user?.[data] : user;
  },
);

export type ReqUser = Pick<User, 'id' | 'roles' | 'wechatOpenId'>;
