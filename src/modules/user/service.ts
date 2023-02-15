import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import CreateUserDto from './dtos/create-user';
import SaltedException from '../../common/exception';
import { ErrCodes } from '../../common/error';
import { randomString } from '../../utils';
import CryptoService from '../crypto/service';
import LoginUserDto from './dtos/login-user';
import { ReqUser } from '../../decorator/req-user';
import ModifyUserDto from './dtos/modify-user';
import { wrap } from '@mikro-orm/core';
import { UserAuditStatus } from '../../common/enums/user';
import User from '../orm/entities/user';

@Injectable()
export default class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
    private readonly cryptoService: CryptoService,
  ) {}

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id, {
      fields: ['nickname', 'avatar'],
    });
    return user;
  }

  async createOneUser(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne(
      { username: createUserDto.username },
      { fields: ['_id'] },
    );
    if (existUser) throw new SaltedException(ErrCodes.USER_EXIST_ERROR);
    const user = new User(createUserDto);
    user.nickname = `xy_${randomString(6)}`;
    user.salt = this.cryptoService.genSalt(6);
    user.password = await this.cryptoService.hashPwd(user.password, user.salt);
    await this.userRepository.persistAndFlush(user);
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const { password, username } = loginUserDto;
    const user = await this.userRepository.findOne(
      { username },
      { fields: ['salt', 'password', 'wechatOpenId', 'roles'] },
    );
    if (!user) throw new SaltedException(ErrCodes.USER_PWD_ERROR);
    const hashPwd = await this.cryptoService.hashPwd(password, user.salt);
    if (user.password !== hashPwd)
      throw new SaltedException(ErrCodes.USER_PWD_ERROR);
    return user;
  }

  async getMyProfile(reqUser: ReqUser) {
    const user = await this.userRepository.findOne(reqUser.id, {
      fields: ['nickname', 'avatar', 'wechatOpenId', 'roles', 'auditProfile'],
    });
    return user;
  }

  async patchMyProfile(reqUser: ReqUser, modifyUserDto: ModifyUserDto) {
    const user = await this.userRepository.findOne(reqUser.id);
    if (user.auditProfile?.status)
      throw new SaltedException(ErrCodes.USER_PROFILE_ONLY_MODIFY_ONCE);
    wrap(user).assign({
      auditProfile: {
        status: UserAuditStatus.WAIT,
        avatar: modifyUserDto.auditAvatar,
        nickname: modifyUserDto.auditNickname,
      },
    });
    await this.userRepository.flush();
  }
}
