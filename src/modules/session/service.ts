import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigVariables } from '../../config';
import { ReqUser } from '../../decorator/req-user';
import CryptoService from '../crypto/service';
import Message from '../orm/entities/message';
import Session from '../orm/entities/session';
import User from '../orm/entities/user';
import CreateSessionDto from './dtos/create-sesstion';
import QuerySessionDto from './dtos/query-session';

@Injectable()
export default class SessionService {
  private readonly userConfig = this.configService.get('user', { infer: true });

  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: EntityRepository<Session>,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    @InjectRepository(Message)
    private readonly messageRepository: EntityRepository<Message>,
    private readonly configService: ConfigService<ConfigVariables>,
    private readonly cryptoService: CryptoService,
  ) {}

  async createOneSession(reqUser: ReqUser, { connector }: CreateSessionDto) {
    await this.userRepository.findOneOrFail(connector);
    const userRefsStrs = [reqUser.id, connector].sort();
    const alreadyExist = await this.sessionRepository.findOne({
      users: userRefsStrs,
    });
    if (alreadyExist) return alreadyExist.id;
    const session = this.sessionRepository.create({});
    session.users.add(
      ...userRefsStrs.map((userId) => this.userRepository.getReference(userId)),
    );
    await this.sessionRepository.persistAndFlush(session);
    return session.id;
  }

  async getMySessions(reqUser: ReqUser, querySessionDto: QuerySessionDto) {
    const { page, perPage } = querySessionDto;
    const sessions = await this.sessionRepository.find(
      { users: reqUser.id },
      {
        limit: perPage,
        offset: (page - 1) * perPage,
        populate: ['users', 'lastMessage'],
        fields: [
          'createdAt',
          'users',
          'users.id',
          'users.nickname',
          'users.avatar',
          'lastMessage',
          'lastMessage.content',
        ],
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
    const unreadAmounts = await Promise.all(
      sessions.map((session) => {
        const sender = session.users
          .toArray()
          .find((user) => user.id !== reqUser.id);
        return this.messageRepository.count({
          readStatus: false,
          receiver: reqUser.id,
          sender: sender.id,
        });
      }),
    );
    return sessions.map((session, idx) => {
      if (session.lastMessage) {
        session.lastMessage.content = this.cryptoService.aesDecodeString(
          session.lastMessage.content,
          this.userConfig.MESSAGE_SECRET,
        );
        session.unreadAmount = unreadAmounts[idx] || 0;
      }
      return session;
    });
  }
}
