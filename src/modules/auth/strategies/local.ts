import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request } from 'express';
import { Strategy } from 'passport-local';
import { ErrCodes } from '../../../common/error';
import SaltedException from '../../../common/exception';
import LoginUserDto from '../../user/dtos/login-user';
import AuthService from '../service';

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      passReqToCallback: true,
    });
  }

  async validate(req: Request) {
    const loginUserDto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(loginUserDto);
    if (errors.length) {
      throw new BadRequestException();
    }
    const isPass = await this.authService.checkCaptcha(
      loginUserDto.deviceId,
      loginUserDto.captchaCode,
    );
    if (!isPass) throw new SaltedException(ErrCodes.CAPTCHA_ERROR);
    const user = await this.authService.validateUser(loginUserDto);
    return user;
  }
}
