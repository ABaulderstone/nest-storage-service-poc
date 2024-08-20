import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';

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
}
