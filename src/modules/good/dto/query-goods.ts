import { IsEnum, IsOptional, MaxLength } from 'class-validator';
import PagingDto from '../../../common/dtos/paging';
import { GoodCategory, GoodRegion } from '../../../common/enums/good';

export default class QueryGoodsDto extends PagingDto {
  @IsOptional()
  @IsEnum(GoodRegion)
  region: GoodRegion;

  @IsOptional()
  @IsEnum(GoodCategory)
  category: GoodCategory;

  @IsOptional()
  @MaxLength(30)
  title: string;
}
