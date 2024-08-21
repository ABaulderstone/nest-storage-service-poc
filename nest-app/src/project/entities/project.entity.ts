import {
  Collection,
  Entity,
  LoadStrategy,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Attachment } from '../../storage/entities/attachement.entity';

@Entity({ tableName: 'projects' })
export class Project {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  githubLink: string;

  @ManyToOne({ entity: () => User })
  owner: User;

  @Property({ persist: false })
  screenshotUrl?: string;
}
