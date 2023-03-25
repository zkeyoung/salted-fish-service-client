import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import MongoIdDto from '../../common/dtos/mongo-id';
import { Public } from '../../decorator/public';
import { ReqUser } from '../../decorator/req-user';
import CreateGoodDto from './dto/create-good';
import PatchGoodsDto from './dto/patch-goods';
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

  @Public()
  @Get()
  getManyGoods(@Query() queryGoodsDto: QueryGoodsDto) {
    return this.goodService.getGoods(queryGoodsDto);
  }

  @Get(':id')
  getOneGood(@ReqUser() reqUser, @Param() { id: goodId }: MongoIdDto) {
    return this.goodService.getOneGood(reqUser, goodId);
  }

  @Patch(':id')
  async patchOneGood(
    @ReqUser() reqUser: ReqUser,
    @Param() { id: goodId }: MongoIdDto,
    @Body() patchGoodsDto: PatchGoodsDto,
  ) {
    return this.goodService.modifyOneGood(reqUser, goodId, patchGoodsDto);
  }

  @Delete(':id')
  deleteOneGood(
    @ReqUser() reqUser: ReqUser,
    @Param() { id: goodId }: MongoIdDto,
  ) {
    return this.goodService.deleteOneGood(reqUser, goodId);
  }
}
