import { PickType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user';

export default class LoginUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
  'wechatOpenId',
  'captchaCode',
]) {}
