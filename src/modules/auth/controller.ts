import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Public } from '../../decorator/public';
import { ReqUser } from '../../decorator/req-user';
import LocalAuthGuard from '../../guard/local-auth';
import CreateUserDto from '../user/dtos/create-user';
import PostAuthCaptchaDto from './dto/post-auth-aptcha';
import RefreshTokenDto from './dto/post-refresh-token';
import AuthService from './service';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('captcha')
  postAuthCaptcha(@Body() postAuthCaptchaDto: PostAuthCaptchaDto) {
    return this.authService.getSvgCaptcha(postAuthCaptchaDto.deviceId);
  }

  @Delete('token/:refreshToken')
  async logout(
    @ReqUser() user: ReqUser,
    @Param() { refreshToken }: RefreshTokenDto,
  ) {
    return this.authService.logout(user, refreshToken);
  }

  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('token')
  postAuthLogin(@ReqUser() user: ReqUser) {
    return this.authService.postLogin(user);
  }

  @Public()
  @Post('user')
  postAuthUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.postAuthUser(createUserDto);
  }

  @Public()
  @Patch('token/:refreshToken')
  postAuthTokenRefresh(@Param() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
