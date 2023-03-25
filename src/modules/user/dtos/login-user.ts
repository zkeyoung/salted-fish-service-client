import { IsOptional, IsString, Length } from 'class-validator';
import { PickType } from '@nestjs/mapped-types';
import CreateUserDto from './create-user';

export default class LoginUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {
  @IsOptional()
  @Length(1, 100)
  deviceId: string;

  @IsString()
  @IsOptional()
  @Length(4, 4)
  captchaCode: string;
}
