import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
  Length,
  Max,
} from 'class-validator';
import { GoodCategory, GoodRegion } from '../../../common/enums/good';

export default class CreateGoodDto {
  @IsString()
  @Length(1, 30)
  title: string;

  @IsString()
  @IsEnum(GoodRegion)
  region: GoodRegion;

  @IsString()
  @IsEnum(GoodCategory)
  category: GoodCategory;

  @IsNumber()
  @IsPositive()
  @Max(9999999999)
  price: number;

  @IsString()
  @Length(1, 300)
  desc: string;

  @IsArray()
  @ArrayMaxSize(5)
  @IsString({ each: true })
  @Length(32, 32, { each: true })
  fileUrls: string[];

  @IsString()
  @Length(32, 32)
  preview: string;
}
