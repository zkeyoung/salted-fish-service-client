import { IsString, Length } from 'class-validator';

export default class PostAuthCaptchaDto {
  @IsString()
  @Length(1, 50)
  wechatOpenId: string;
}
