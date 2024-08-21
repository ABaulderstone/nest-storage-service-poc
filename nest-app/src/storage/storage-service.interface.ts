export interface StorageService {
  getPresignedUrl(key: string): Promise<string>;
  upload(file: Express.Multer.File): Promise<{ key: string }>;
}
