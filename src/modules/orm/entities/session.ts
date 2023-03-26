import {
  Collection,
  Entity,
  ManyToMany,
  OneToMany,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import BaseEntity from './base';
import Message from './message';
import User from './user';

@Entity({
  collection: 'Sessions',
})
export default class Session extends BaseEntity {
  @ManyToMany(() => User, (user) => user.sessions, { owner: true })
  users = new Collection<User>(this);

  @OneToMany(() => Message, (message) => message.session)
  messages = new Collection<Message>(this);

  @OneToOne({ nullable: true })
  lastMessage?: Message;

  @Property({ nullable: true })
  unreadAmount?: number;

  constructor(session: Partial<Session>) {
    super(session);
    Object.assign(this, session);
  }
}
