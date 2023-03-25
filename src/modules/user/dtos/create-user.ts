import { IsString, Length, IsOptional } from 'class-validator';

export default class CreateUserDto {
  @IsString()
  @Length(6, 22)
  username: string;

  @IsString()
  @Length(8, 16)
  password: string;

  @IsString()
  @Length(6, 6)
  inviteCode: string;
}
