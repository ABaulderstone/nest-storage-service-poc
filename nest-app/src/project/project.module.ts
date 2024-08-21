import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { UserService } from '../user/user.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Project } from './entities/project.entity';
import { UserModule } from '../user/user.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [UserModule, StorageModule, MikroOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
