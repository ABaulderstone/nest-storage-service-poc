import { HttpModule, HttpService } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorageService } from './local-storage.service';
import { S3StorageService } from './s3-storage.service';
import { AttachmentService } from './attachment.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Attachment } from './entities/attachement.entity';

@Module({
  imports: [ConfigModule, HttpModule, MikroOrmModule.forFeature([Attachment])],
  providers: [
    {
      provide: 'STORAGE_SERVICE',
      useFactory: (configService: ConfigService, httpService: HttpService) => {
        const env = configService.get<string>('NODE_ENV', 'development');
        return env === 'development' || env === 'test'
          ? new LocalStorageService(httpService, configService)
          : new S3StorageService();
      },
      inject: [ConfigService, HttpService],
    },
    AttachmentService,
  ],
  exports: [AttachmentService],
})
export class StorageModule {}
