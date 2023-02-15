import { Module } from '@nestjs/common';
import AuthModule from '../auth';
import CryptoModule from '../crypto';
import MessageModule from '../message';
import WsService from './service';
import WsGatewayController from './ws-controller';

@Module({
  imports: [CryptoModule, AuthModule, MessageModule],
  providers: [WsGatewayController, WsService],
})
export default class GatewayModule {}
