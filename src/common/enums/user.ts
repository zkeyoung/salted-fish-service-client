export enum UserRole {
  GUEST = 'guest',
  MEMBER = 'member',
  ADMIN = 'admin',
}

/** 用户信息审核状态 */
export enum UserAuditStatus {
  WAIT = 'wait',
  PASS = 'pass',
  REFUSE = 'refuse',
}
