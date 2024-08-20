import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UserService } from '../user/user.service';
import { ServiceValidationError } from '../shared/exceptions/errors/ServiceValidation.error';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Project } from './entities/project.entity';
import { EntityRepository } from '@mikro-orm/core';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project) private readonly repo: EntityRepository<Project>,
    private readonly userService: UserService,
  ) {}
  async create(createProjectDto: CreateProjectDto) {
    const validationError = new ServiceValidationError();
    const { ownerId, ...data } = createProjectDto;
    const foundUser = await this.userService.findOne(ownerId);
    if (!foundUser) {
      validationError.add('owner', `could not find owner with id ${ownerId}`);
      throw validationError;
    }
    const newProject = plainToInstance(Project, data);
    newProject.owner = foundUser;
    await this.repo.create(newProject);
    await this.repo.getEntityManager().persistAndFlush(newProject);
    return newProject;
  }

  findAll() {
    return `This action returns all project`;
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }

  update(id: number, updateProjectDto: UpdateProjectDto) {
    return `This action updates a #${id} project`;
  }

  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
