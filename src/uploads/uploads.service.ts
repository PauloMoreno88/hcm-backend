import { Inject, Injectable } from '@nestjs/common';
import type { StoragePort } from './storage/storage.port';
import { STORAGE_PORT } from './storage/storage.port';

export type UploadedFilePayload = {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
};

@Injectable()
export class UploadsService {
  constructor(@Inject(STORAGE_PORT) private readonly storage: StoragePort) {}

  async uploadFile(file: UploadedFilePayload) {
    const result = await this.storage.upload(file);
    return {
      url: result.url,
      key: result.key,
      fileType: file.mimeType,
    };
  }
}
