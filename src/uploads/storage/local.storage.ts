import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';
import type { StoragePort, UploadInput, UploadResult } from './storage.port';

export class LocalStorage implements StoragePort {
  constructor(private readonly config: ConfigService) {}

  async upload(input: UploadInput): Promise<UploadResult> {
    const root = this.config.get<string>('STORAGE_LOCAL_DIR', 'uploads');
    const publicBase = this.config
      .get<string>('STORAGE_PUBLIC_BASE_URL', 'http://localhost:3000')
      .replace(/\/$/, '');
    const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${randomUUID()}-${safeName}`;
    const absoluteDir = join(process.cwd(), root);
    await mkdir(absoluteDir, { recursive: true });
    await writeFile(join(absoluteDir, key), input.buffer);
    const url = `${publicBase}/uploads/${key}`;
    return { url, key };
  }
}
