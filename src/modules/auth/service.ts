import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Cache } from 'cache-manager';
import SvgCaptcha from 'svg-captcha';
import { Environment } from '../../common/enums/app';
import { CacheType } from '../../common/enums/cache';
import { ErrCodes } from '../../common/error';
import SaltedException from '../../common/exception';
import { ConfigVariables } from '../../config';
import { ReqUser } from '../../decorator/req-user';
import CryptoService from '../crypto/service';
import CreateUserDto from '../user/dtos/create-user';
import LoginUserDto from '../user/dtos/login-user';
import UserService from '../user/service';

@Injectable()
export default class AuthService {
  private readonly app = this.configService.get('app', { infer: true });
  private readonly ttl = this.configService.get('ttl', { infer: true });
  private readonly token = this.configService.get('token', { infer: true });

  constructor(
    private readonly configService: ConfigService<ConfigVariables>,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
  ) {}

  async getSvgCaptcha(
    wechatOpenId: string,
  ): Promise<{ text?: string; captcha: string }> {
    const { text, data: captcha } = SvgCaptcha.create({
      noise: 3,
      background: '#f0f0f0',
    });
    await this.cacheManager.set(
      `${CacheType.GET_SVG_CAPTCHA}:${wechatOpenId}`,
      text,
      { ttl: this.ttl.GET_SVG_CAPTCHA },
    );
    return {
      text: this.app.env === Environment.DEVELOPMENT ? text : undefined,
      captcha,
    };
  }

  async checkCaptcha(wechatOpenId, captcha) {
    const cacheText = await this.cacheManager.get(
      `${CacheType.GET_SVG_CAPTCHA}:${wechatOpenId}`,
    );
    await this.cacheManager.del(`${CacheType.GET_SVG_CAPTCHA}:${wechatOpenId}`);
    if (!cacheText) return false;
    return cacheText === captcha;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    return this.userService.validateUser(loginUserDto);
  }

  async postLogin(user: ReqUser) {
    const payload = {
      id: user.id,
      roles: user.roles,
      wechatOpenId: user.wechatOpenId,
    };
    const accessToken = await this.jwtSignPayload(payload);
    this.cacheManager.set(
      `${CacheType.REFRESH_TOKEN}:${user.wechatOpenId}`,
      payload,
      { ttl: this.token.REFRESH_TOKEN_EXPIRE },
    );
    const refreshTokenBuffer = this.cryptoService.aesEncode(
      Buffer.from(user.wechatOpenId),
      this.token.REFRESH_TOKEN_SECRET,
    );
    return { accessToken, refreshToken: refreshTokenBuffer.toString('hex') };
  }

  async postAuthUser(createUserDto: CreateUserDto) {
    const isPass = await this.checkCaptcha(
      createUserDto.wechatOpenId,
      createUserDto.captchaCode,
    );
    if (!isPass) throw new SaltedException(ErrCodes.CAPTCHA_ERROR);
    return await this.userService.createOneUser(createUserDto);
  }

  private async jwtSignPayload(payload: object) {
    const payloadBuffer = this.cryptoService.aesEncode(
      Buffer.from(JSON.stringify(payload)),
      this.token.TOKEN_PAYLOAD_SECRET,
    );
    const payloadEncrypt = payloadBuffer.toString('hex');
    return await this.jwtService.signAsync({ encrypt: payloadEncrypt });
  }

  async refreshToken(reqUser: ReqUser, refreshTokenEncrypt: string) {
    const refreshTokenBuffer = this.cryptoService.aesDecode(
      Buffer.from(refreshTokenEncrypt, 'hex'),
      this.token.REFRESH_TOKEN_SECRET,
    );
    const refreshToken = refreshTokenBuffer.toString('utf8');
    if (reqUser.wechatOpenId !== refreshToken) throw new BadRequestException();
    const payload = await this.cacheManager.get<object>(
      `${CacheType.REFRESH_TOKEN}:${reqUser.wechatOpenId}`,
    );
    if (!payload) throw new SaltedException(ErrCodes.LOGIN_EXPIRED);
    const accessToken = await this.jwtSignPayload(payload);
    return { accessToken };
  }
}
