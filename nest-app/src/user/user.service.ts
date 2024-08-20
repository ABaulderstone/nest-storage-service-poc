import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, wrap } from '@mikro-orm/mysql';
import { User } from './entities/user.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly repo: EntityRepository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const newUser = plainToInstance(User, createUserDto);
    await this.repo.create(newUser);
    await this.repo.getEntityManager().persistAndFlush(newUser);
    return newUser;
  }

  findAll() {
    return this.repo.findAll();
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) {
      return user;
    }
    wrap(user).assign(updateUserDto);
    await this.repo.getEntityManager().persistAndFlush(user);
    return user;
  }

  async remove(id: number) {
    const affectedRows = await this.repo.nativeDelete(id);
    return !!affectedRows;
  }
}
