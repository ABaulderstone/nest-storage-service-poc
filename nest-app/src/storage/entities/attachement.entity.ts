import {
  Collection,
  Entity,
  EntityManager,
  ManyToMany,
  ManyToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({ tableName: 'attachments' })
export class Attachment {
  @PrimaryKey()
  id: number;

  @Property()
  key: string;

  @Property()
  originalName: string;
  @Property()
  mimeType: string;

  @Property()
  attachableType: string;

  @Property()
  attachableId: number;
}
