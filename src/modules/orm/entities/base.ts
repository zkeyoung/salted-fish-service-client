import { PrimaryKey, Property, SerializedPrimaryKey } from '@mikro-orm/core';
import { ObjectId } from '@mikro-orm/mongodb';

export default abstract class BaseEntity {
  @PrimaryKey({ hidden: true })
  _id: ObjectId;

  @SerializedPrimaryKey()
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @Property({ hidden: true })
  deletedAt: Date = new Date(0);

  constructor(baseEntity: Partial<BaseEntity>) {
    Object.assign(this, baseEntity);
  }
}
