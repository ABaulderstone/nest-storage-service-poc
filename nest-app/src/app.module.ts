import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProjectModule } from './project/project.module';
import { UserModule } from './user/user.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [MikroOrmModule.forRoot(), ProjectModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
