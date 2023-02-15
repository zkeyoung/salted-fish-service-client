import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import BaseEntity from './base';
import { UserRole } from '../../../common/enums/user';
import Good from './good';
import Session from './session';

@Entity({
  collection: 'Users',
})
export default class User extends BaseEntity {
  @Property({ hidden: true })
  username: string;

  @Property({ hidden: true })
  password: string;

  @Property({ hidden: true })
  salt: string;

  @Property({ hidden: true, nullable: true })
  wechatOpenId?: string;

  @Enum(() => UserRole)
  roles: UserRole = UserRole.MEMBER;

  @Property()
  nickname!: string;

  @Property({ nullable: true })
  avatar?: string;

  @Property({ nullable: true })
  auditProfile?: {
    status: string;
    message?: string;
    nickname: string;
    avatar: string;
  };

  @OneToMany(() => Good, (good) => good.user)
  goods = new Collection<Good>(this);

  @ManyToMany(() => Session, (session) => session.users)
  sessions = new Collection<Session>(this);

  constructor(user: Partial<User>) {
    super(user);
    Object.assign(this, user);
  }
}
