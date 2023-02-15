import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { MessageType } from '../../../common/enums/message';

export default class PostMessageDto {
  @IsString()
  @Length(24, 24)
  session: string;

  @IsString()
  @Length(1, 250)
  content: string;

  @IsEnum(MessageType)
  @IsOptional()
  type: MessageType;
}
