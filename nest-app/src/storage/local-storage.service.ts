import { HttpService } from '@nestjs/axios';
import { StorageService } from './storage-service.interface';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

export class LocalStorageService implements StorageService {
  private readonly baseURL: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseURL = this.configService.get('LOCAL_STORAGE_BASE_URL');
  }

  async getPresignedUrl(key: string): Promise<string> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseURL}/presigned/${key}`),
    );
    return response.data.url;
  }
  async upload(file: Express.Multer.File) {
    const formData = new FormData();
    formData.append('file', new Blob([file.buffer]), file.originalname);
    const response = await lastValueFrom(
      this.httpService.post(`${this.baseURL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    );
    return response.data;
  }
}
