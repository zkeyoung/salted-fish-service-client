export const ErrCodes = {
  /** 用户已存在 */
  USER_EXIST_ERROR: 90001,
  /** 账号或密码错误 */
  USER_PWD_ERROR: 90002,
  /** 用户昵称已存在 */
  USER_NICKNAME_EXIST_ERR: 90003,
  /** 个人资料仅能修改一次 */
  USER_PROFILE_ONLY_MODIFY_ONCE: 90004,

  /** 验证码错误 */
  CAPTCHA_ERROR: 91001,
  /** 邀请码错误 */
  INVITE_CODE_ERROR: 91002,
  /** 登录失效 */
  LOGIN_EXPIRED: 91003,
};

export const ErrMsg = {
  [ErrCodes.USER_EXIST_ERROR]: 'username already exist',
  [ErrCodes.USER_PWD_ERROR]: 'user or pwd error',
  [ErrCodes.USER_NICKNAME_EXIST_ERR]: 'nickname already exist',
  [ErrCodes.CAPTCHA_ERROR]: 'captcha is error',
  [ErrCodes.INVITE_CODE_ERROR]: 'invite code is error',
  [ErrCodes.USER_PROFILE_ONLY_MODIFY_ONCE]: 'user profile only modify once',
  [ErrCodes.LOGIN_EXPIRED]: 'login status is expired',
};
