import { Module } from '@nestjs/common';
import CryptoModule from '../crypto';
import OrmModule from '../orm';
import UsersController from './controller';
import UserService from './service';

@Module({
  imports: [OrmModule, CryptoModule],
  controllers: [UsersController],
  providers: [UserService],
  exports: [UserService],
})
export default class UserModule {}
