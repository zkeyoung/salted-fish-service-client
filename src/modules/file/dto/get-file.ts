import { IsString, Length } from 'class-validator';

export default class GetFileDto {
  @IsString()
  @Length(32, 32)
  fileId: string;
}
