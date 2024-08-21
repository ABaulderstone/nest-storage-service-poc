import { StorageService } from './storage-service.interface';

export class S3StorageService implements StorageService {
  getPresignedUrl(key: string): Promise<string> {
    throw new Error('Method not implemented.');
  }
  upload(file: Express.Multer.File): Promise<unknown> {
    throw new Error('Method not implemented.');
  }
}
