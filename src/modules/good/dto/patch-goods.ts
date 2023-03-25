import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import CreateGoodsDto from './create-good';

export default class PatchGoodsDto extends PartialType(CreateGoodsDto) {
  @IsOptional()
  @IsBoolean()
  isOnShelf: boolean;
}
