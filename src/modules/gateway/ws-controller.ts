import {
  UseFilters,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Environment } from '../../common/enums/app';
import { ReqUser } from '../../decorator/req-user';
import CatchUnhandleWsException from '../../filter/ws-exception.filter';
import WsLoggerInterceptor from '../../Interceptor/ws-logger.interceptor';
import MessageService from '../message/service';
import PostMessageDto from './dtos/post-message';
import WsService from './service';

type UserSocket = Socket & { user: ReqUser };

@UseInterceptors(WsLoggerInterceptor)
@UsePipes(
  new ValidationPipe({
    disableErrorMessages: process.env.NODE_ENV === Environment.PRODUCTION,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
)
@UseFilters(CatchUnhandleWsException)
@WebSocketGateway({
  cors: {
    origin: 'null',
  },
})
export default class WsGatewayController
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly wsService: WsService,
    private readonly messageService: MessageService,
  ) {}

  async handleConnection(client: UserSocket) {
    try {
      const bearerToken = client.handshake.auth.token;
      if (typeof bearerToken !== 'string') throw new Error('no auth');
      const [schema, jwtToken] = bearerToken.split(' ');
      if (schema !== 'Bearer' || !jwtToken.length) throw new Error('no auth');
      const user = await this.wsService.parseJwtLoginToken(jwtToken);
      client.user = user;
      client.join(user.id);
    } catch (err) {
      client.disconnect();
    }
  }

  handleDisconnect(client: UserSocket) {
    if (client.user) {
      client.leave(client.user.id);
    }
  }

  @SubscribeMessage('message:post')
  async postMessage(client: UserSocket, postMessageDto: PostMessageDto) {
    const message = await this.messageService.sendMessage(
      client.user,
      postMessageDto,
    );
    const receiver = message.receiver;
    client.to(receiver.id).emit('message', postMessageDto.content);
  }
}
