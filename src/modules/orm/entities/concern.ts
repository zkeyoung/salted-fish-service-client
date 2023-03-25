import { Entity, Property, OneToOne } from '@mikro-orm/core';
import BaseEntity from './base';
import Good from './good';
import User from './user';

@Entity({
  collection: 'Concerns',
})
export default class Concern extends BaseEntity {
  @Property({ type: 'boolean' })
  enable = true;

  @OneToOne(() => Good)
  good: Good;

  @OneToOne(() => User)
  user: User;
}
