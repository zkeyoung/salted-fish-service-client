import { Test, TestingModule } from '@nestjs/testing';
import { UserRole } from '../../common/enums/user';
import { ReqUser } from '../../decorator/req-user';
import UsersController from './controller';
import ModifyUserDto from './dtos/modify-user';
import UserService from './service';

let usersController: UsersController;
let userService: UserService;

const user = {
  id: '634678a2a53edd455da55cb6',
  roles: UserRole.MEMBER,
  nickname: 'xy_dvlMsE',
  auditProfile: {
    status: 'wait',
    avatar: '1586508274b94b29a19de26edcc6ecef',
    nickname: 'reverse星河4',
  },
};
const reqUser: ReqUser = {
  id: user.id,
  roles: user.roles,
  wechatOpenId: 'test',
};

beforeAll(async () => {
  const app: TestingModule = await Test.createTestingModule({
    controllers: [UsersController],
    providers: [
      {
        provide: UserService,
        useValue: {
          findUserById: jest.fn().mockResolvedValue(user),
          getMyProfile: jest.fn().mockResolvedValue(user),
          patchMyProfile: jest.fn().mockResolvedValue(undefined),
        },
      },
    ],
  }).compile();

  usersController = app.get<UsersController>(UsersController);
  userService = app.get<UserService>(UserService);
});

describe('base check', () => {
  it('should be defined', () => {
    expect(UsersController).toBeDefined();
    expect(UserService).toBeDefined();
  });
});

describe('getMyProfile()', () => {
  it('should return my profile', () => {
    usersController.getMyProfile(reqUser);
    expect(userService.getMyProfile).toHaveBeenCalled();
  });
});

describe('patchMyProfile()', () => {
  it('should patch my profile', () => {
    usersController.patchMyProfile(reqUser, new ModifyUserDto());
    expect(userService.patchMyProfile).toHaveBeenCalled();
  });
});

describe('getOneUser()', () => {
  it('should find a user', () => {
    usersController.getOneUser(reqUser.id);
    expect(userService.findUserById).toHaveBeenCalled();
  });
});
