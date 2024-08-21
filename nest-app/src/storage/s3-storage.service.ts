import { StorageService } from './storage-service.interface';

export class S3StorageService implements StorageService {
  getPresignedUrl(key: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  async upload(file: Express.Multer.File) {
    return { key: 'd' };
  }
}
