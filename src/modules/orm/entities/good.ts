import { Entity, Enum, ManyToOne, Property } from '@mikro-orm/core';
import BaseEntity from './base';
import {
  GoodAuditStatus,
  GoodCategory,
  GoodRegion,
} from '../../../common/enums/good';
import User from './user';

@Entity({
  collection: 'Goods',
})
export default class Good extends BaseEntity {
  @ManyToOne(() => User)
  user!: User;

  @Property()
  title!: string;

  @Enum(() => GoodRegion)
  region!: GoodRegion;

  @Enum(() => GoodCategory)
  category!: GoodCategory;

  @Property()
  price!: number;

  @Property()
  desc!: string;

  @Enum(() => GoodAuditStatus)
  auditStatus: GoodAuditStatus = GoodAuditStatus.WAIT;

  @Property({ nullable: true })
  auditMessage?: string;

  @Property()
  isOnShelf = false;

  @Property()
  fileUrls: string[];

  @Property()
  preview: string;

  constructor(partial: Partial<Good>) {
    super(partial);
    Object.assign(this, partial);
  }
}
