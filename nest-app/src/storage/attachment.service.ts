import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Attachment } from './entities/attachement.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { StorageService } from './storage-service.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AttachmentService {
  constructor(
    @InjectRepository(Attachment)
    private readonly repo: EntityRepository<Attachment>,
    @Inject('STORAGE_SERVICE') private readonly storageService: StorageService,
  ) {}

  async create(
    file: Express.Multer.File,
    attachableType: string,
    attachableId: number,
  ) {
    const { key } = await this.storageService.upload(file);
    const { mimetype, originalname } = file;
    const data = {
      key,
      mimeType: mimetype,
      originalName: originalname
        .replace(/\s+/g, '_')
        .replace(/[(){}\[\]]/g, ''),
      attachableType,
      attachableId,
    };
    const newAttachment = plainToInstance(Attachment, data);
    await this.repo.getEntityManager().persistAndFlush(newAttachment);
    return newAttachment;
  }
}
