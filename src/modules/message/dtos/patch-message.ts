import { IsArray, IsString, Length } from 'class-validator';

export default class PatchMessageDto {
  @IsArray()
  @IsString({ each: true })
  @Length(24, 24, { each: true })
  msgIds: string[];
}
