import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MongoIdDto from '../../common/dtos/mongo-id';
import { ConfigVariables } from '../../config';
import { ReqUser } from '../../decorator/req-user';
import CryptoService from '../crypto/service';
import PostMessageDto from '../gateway/dtos/post-message';
import Message from '../orm/entities/message';
import Session from '../orm/entities/session';
import User from '../orm/entities/user';
import GetSessionMessagesDto from './dtos/get-session-message';
import PatchMessageDto from './dtos/patch-message';

@Injectable()
export default class MessageService {
  private readonly userConfig = this.configService.get('user', { infer: true });

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: EntityRepository<Message>,
    @InjectRepository(Session)
    private readonly sessionRepository: EntityRepository<Session>,
    private readonly configService: ConfigService<ConfigVariables>,
    private readonly cryptoService: CryptoService,
  ) {}

  countUnreadMessage(reqUser: ReqUser) {
    return this.messageRepository.count({
      receiver: reqUser.id,
      readStatus: false,
    });
  }

  async modifyMessageReadStatus(reqUser: ReqUser, { msgIds }: PatchMessageDto) {
    const messages = await this.messageRepository.find({
      receiver: reqUser.id,
      id: msgIds,
      readStatus: false,
    });

    if (!messages.length) return;

    messages.forEach((message) => {
      message.readStatus = true;
    });

    return this.messageRepository.flush();
  }

  async getOneSessionMessages(
    @ReqUser() reqUser: ReqUser,
    mongoIdDto: MongoIdDto,
    { page, perPage }: GetSessionMessagesDto,
  ) {
    const session = await this.sessionRepository.findOneOrFail({
      users: reqUser.id,
      id: mongoIdDto.id,
    });
    const msgs = await session.messages.matching({
      offset: (page - 1) * perPage,
      limit: perPage,
      fields: ['content', 'createdAt', 'sender', 'sender.id', 'readStatus'],
    });
    return msgs.map((msg) => {
      msg.content = this.cryptoService.aesDecodeString(
        msg.content,
        this.userConfig.MESSAGE_SECRET,
      );
      return msg;
    });
  }

  async sendMessage(reqUser: ReqUser, postMessageDto: PostMessageDto) {
    const session = await this.sessionRepository.findOneOrFail(
      { id: postMessageDto.session },
      { fields: ['users'] },
    );
    const users = session.users.getItems();
    let sender: User = null,
      receiver: User = null;
    if (users[0].id === reqUser.id) {
      sender = users[0];
      receiver = users[1];
    }
    if (users[1].id === reqUser.id) {
      sender = users[1];
      receiver = users[0];
    }
    if (!sender) throw new BadRequestException();

    const message = this.messageRepository.create(postMessageDto);
    message.sender = sender;
    message.receiver = receiver;
    message.content = this.cryptoService.aesEncodeString(
      message.content,
      this.userConfig.MESSAGE_SECRET,
    );

    session.lastMessage = message;
    await this.messageRepository.persistAndFlush(message);

    return message;
  }
}
