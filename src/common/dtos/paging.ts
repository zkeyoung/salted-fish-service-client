import { IsNumber } from 'class-validator';

export default class PagingDto {
  @IsNumber()
  page: number;

  @IsNumber()
  perPage: number;
}
