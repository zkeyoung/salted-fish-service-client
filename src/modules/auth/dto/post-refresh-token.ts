import { IsString, Length } from 'class-validator';

export default class RefreshTokenDto {
  @IsString()
  @Length(1, 100)
  refreshToken: string;
}
