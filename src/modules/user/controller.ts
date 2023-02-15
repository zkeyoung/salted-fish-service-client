import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ReqUser } from '../../decorator/req-user';
import ModifyUserDto from './dtos/modify-user';
import UserService from './service';

@Controller('users')
export default class UsersController {
  constructor(private readonly userService: UserService) {}

  @Get('mine')
  getMyProfile(@ReqUser() reqUser: ReqUser) {
    return this.userService.getMyProfile(reqUser);
  }

  @Patch('mine')
  patchMyProfile(
    @ReqUser() reqUser: ReqUser,
    @Body() modifyUserDto: ModifyUserDto,
  ) {
    return this.userService.patchMyProfile(reqUser, modifyUserDto);
  }

  @Get(':userId')
  getOneUser(@Param('userId') userId: string) {
    return this.userService.findUserById(userId);
  }
}
