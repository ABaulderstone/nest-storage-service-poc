import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
export type AttachableType = 'Project' | 'User';

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
  attachableType: AttachableType;

  @Property()
  attachableId: number;
}
