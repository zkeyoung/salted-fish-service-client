import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import MongoIdDto from '../../common/dtos/mongo-id';
import { ReqUser } from '../../decorator/req-user';
import GetSessionMessagesDto from './dtos/get-session-message';
import PatchMessageDto from './dtos/patch-message';
import MessageService from './service';

@Controller('messages')
export default class MessagesController {
  constructor(private readonly messageService: MessageService) {}

  @Get('unread-amount')
  getMyUnreadMessageAmount(@ReqUser() reqUser: ReqUser) {
    return this.messageService.countUnreadMessage(reqUser);
  }

  @Get('sessions/:id')
  getOneSessionMessages(
    @ReqUser() reqUser,
    @Param() mongoIdDto: MongoIdDto,
    @Query() getSessionMessagesDto: GetSessionMessagesDto,
  ) {
    return this.messageService.getOneSessionMessages(
      reqUser,
      mongoIdDto,
      getSessionMessagesDto,
    );
  }

  @Patch('read-status')
  patchMessagesStatus(
    @ReqUser() reqUser,
    @Body() patchMessageDto: PatchMessageDto,
  ) {
    return this.messageService.modifyMessageReadStatus(
      reqUser,
      patchMessageDto,
    );
  }
}
