import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import MongoIdDto from '../../common/dtos/mongo-id';
import PagingDto from '../../common/dtos/paging';
import { ReqUser } from '../../decorator/req-user';
import ConcernService from './service';

@Controller('concerns')
export default class ConcernControler {
  constructor(private readonly concernService: ConcernService) {}

  @Get()
  getConcerns(@ReqUser() reqUser: ReqUser, @Query() pagingDto: PagingDto) {
    return this.concernService.getMyConcerns(reqUser, pagingDto);
  }

  @Post('one')
  async postOneConcern(
    @ReqUser() reqUser: ReqUser,
    @Body() { id: goodId }: MongoIdDto,
  ) {
    await this.concernService.changeMyConcern(reqUser, goodId);
  }
}
