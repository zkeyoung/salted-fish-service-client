import { Entity, Enum, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { MessageType } from '../../../common/enums/message';
import BaseEntity from './base';
import Session from './session';
import User from './user';

@Entity({
  collection: 'Messages',
})
export default class Message extends BaseEntity {
  @OneToOne(() => User)
  sender!: User;

  @OneToOne(() => User)
  receiver!: User;

  @ManyToOne(() => Session)
  session!: Session;

  @Enum(() => MessageType)
  type: MessageType = MessageType.TEXT;

  @Property()
  content!: string;

  @Property()
  readStatus = false;

  constructor(message: Partial<Message>) {
    super(message);
    Object.assign(this, message);
  }
}
