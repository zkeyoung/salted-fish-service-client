import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ReqUser } from '../../decorator/req-user';
import CreateSessionDto from './dtos/create-sesstion';
import QuerySessionDto from './dtos/query-session';
import SessionService from './service';

@Controller('sessions')
export default class SessionsController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getSessions(
    @ReqUser() reqUser: ReqUser,
    @Query() querySessionDto: QuerySessionDto,
  ) {
    return this.sessionService.getMySessions(reqUser, querySessionDto);
  }

  @Post('one')
  postOneSession(
    @ReqUser() reqUser: ReqUser,
    @Body() createSessionDto: CreateSessionDto,
  ) {
    return this.sessionService.createOneSession(reqUser, createSessionDto);
  }
}
