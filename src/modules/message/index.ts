import { Module } from '@nestjs/common';
import CryptoModule from '../crypto';
import OrmModule from '../orm';
import MessagesController from './controller';
import MessageService from './service';

@Module({
  imports: [OrmModule, CryptoModule],
  controllers: [MessagesController],
  providers: [MessageService],
  exports: [MessageService],
})
export default class MessageModule {}
