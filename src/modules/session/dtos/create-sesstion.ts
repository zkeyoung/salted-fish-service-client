import { IsString, Length } from 'class-validator';

export default class CreateSessionDto {
  @IsString()
  @Length(24, 24)
  connector: string;
}
