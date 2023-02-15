import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReqUser } from '../../decorator/req-user';
import CreateGoodDto from './dto/create-good';
import QueryGoodsDto from './dto/query-goods';
import GoodService from './service';

@Controller('goods')
export default class GoodsController {
  constructor(private readonly goodService: GoodService) {}

  @Get('users/mine')
  getMyGoods(
    @ReqUser() reqUser: ReqUser,
    @Query() queryGoodsDto: QueryGoodsDto,
  ) {
    return this.goodService.getMyGoods(reqUser, queryGoodsDto);
  }

  @Post('one')
  postOneGood(
    @ReqUser() reqUser: ReqUser,
    @Body() createGoodDto: CreateGoodDto,
  ) {
    return this.goodService.publishOneGood(reqUser, createGoodDto);
  }

  @Get()
  getManyGoods(@Query() queryGoodsDto: QueryGoodsDto) {
    return this.goodService.getGoods(queryGoodsDto);
  }

  @Get(':id')
  getOneGood(@Param('id') goodId: string) {
    return this.goodService.getOneGood(goodId);
  }

  @Delete(':id')
  deleteOneGood(@Param('id') goodId: string) {
    return this.goodService.deleteOneGood(goodId);
  }
}
