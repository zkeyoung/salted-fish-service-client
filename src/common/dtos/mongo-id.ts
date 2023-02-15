import { IsString, Length } from 'class-validator';

export default class MongoIdDto {
  @IsString()
  @Length(24, 24)
  id: string;
}
