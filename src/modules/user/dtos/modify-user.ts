import { IsOptional, IsString, Length } from 'class-validator';

export default class ModifyUserDto {
  @IsString()
  @Length(32, 32)
  @IsOptional()
  auditAvatar: string;

  @IsString()
  @Length(3, 12)
  auditNickname: string;
}
