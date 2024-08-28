import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable } from '@nestjs/common';
import { Attachment } from './entities/attachement.entity';
import { EntityRepository } from '@mikro-orm/mysql';
import { StorageService } from './storage-service.interface';
import { plainToInstance } from 'class-transformer';
import { PresignedUrlMap } from './types';
import { AttachableType } from './entities/attachement.entity';

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
      originalName: originalname,
      attachableType,
      attachableId,
    };
    const newAttachment = plainToInstance(Attachment, data);
    await this.repo.getEntityManager().persistAndFlush(newAttachment);
    return newAttachment;
  }

  findOne(attachableType: AttachableType, attachableId: number) {
    return this.repo.findOne({ $and: [{ attachableId }, { attachableType }] });
  }

  findMany(attachableType: AttachableType, attachableTds: number[]) {
    return this.repo.find({
      $and: [{ attachableType }, { attachableId: { $in: attachableTds } }],
    });
  }

  getPresignedUrl(key: string) {
    return this.storageService.getPresignedUrl(key);
  }

  async getManyPresignedUrls(keys: string[]): Promise<PresignedUrlMap> {
    const promises = keys.map((key) => this.getPresignedUrl(key));
    const results = await Promise.allSettled(promises);
    const urls = results.reduce((list, result) => {
      if (result.status === 'fulfilled') {
        list.push(result.value);
      }
      return list;
    }, []);

    return keys.reduce((map, key, index) => {
      map[key] = { key, url: urls[index] };
      return map;
    }, {} as PresignedUrlMap);
  }
}
