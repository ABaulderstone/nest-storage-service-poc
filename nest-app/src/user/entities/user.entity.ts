import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Project } from '../../project/entities/project.entity';
import { Transform } from 'class-transformer';
import { Attachment } from '../../storage/entities/attachement.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: number;

  @Transform(({ value }) => value.trim().toLowerCase())
  @Property({ unique: true })
  email: string;

  @Transform(({ value }) => value.trim())
  @Property()
  username: string;

  @OneToMany({ entity: () => Project, mappedBy: 'owner' })
  projects = new Collection<Project>(this);
}
