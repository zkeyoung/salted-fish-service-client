import { IsString, Length } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @Length(6, 22)
  username: string;

  @IsString()
  @Length(8, 16)
  password: string;

  @IsString()
  @Length(4, 4)
  captchaCode: string;

  @IsString()
  @Length(6, 6)
  inviteCode: string;

  @IsString()
  @Length(1, 100)
  wechatOpenId: string;
}
