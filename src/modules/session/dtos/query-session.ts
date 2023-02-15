import { IsNumber } from 'class-validator';

export default class QuerySessionDto {
  @IsNumber()
  page: number;

  @IsNumber()
  perPage: number;
}
