import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { Project } from '../../project/entities/project.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  email: string;

  @Property()
  username: string;

  @OneToMany({ entity: () => Project, mappedBy: 'owner' })
  projects = new Collection<Project>(this);
}
