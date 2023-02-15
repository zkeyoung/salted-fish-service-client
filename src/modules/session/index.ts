import { Module } from '@nestjs/common';
import CryptoModule from '../crypto';
import OrmModule from '../orm';
import SessionsController from './controller';
import SessionService from './service';

@Module({
  imports: [OrmModule, CryptoModule],
  controllers: [SessionsController],
  providers: [SessionService],
})
export default class SessionModule {}
