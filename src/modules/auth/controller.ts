import { Body, Controller, Post, UseGuards } from '@nestjs/common';
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
    return this.authService.getSvgCaptcha(postAuthCaptchaDto.wechatOpenId);
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

  @Post('token/refresh')
  postAuthTokenRefresh(
    @ReqUser() reqUser: ReqUser,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshToken(reqUser, refreshTokenDto.refreshToken);
  }
}
