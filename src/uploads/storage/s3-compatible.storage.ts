import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import type { StoragePort, UploadInput, UploadResult } from './storage.port';

export class S3CompatibleStorage implements StoragePort {
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly publicBase: string;

  constructor(private readonly config: ConfigService) {
    const region = this.config.getOrThrow<string>('S3_REGION');
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKeyId = this.config.getOrThrow<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.config.getOrThrow<string>(
      'S3_SECRET_ACCESS_KEY',
    );
    this.bucket = this.config.getOrThrow<string>('S3_BUCKET');
    this.publicBase = this.config
      .getOrThrow<string>('S3_PUBLIC_BASE_URL')
      .replace(/\/$/, '');
    const forcePathStyle =
      this.config.get<string>('S3_FORCE_PATH_STYLE') === 'true' ||
      Boolean(endpoint);

    this.client = new S3Client({
      region,
      endpoint: endpoint || undefined,
      forcePathStyle,
      credentials: { accessKeyId, secretAccessKey },
    });
  }

  async upload(input: UploadInput): Promise<UploadResult> {
    const safeName = input.originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const key = `${randomUUID()}-${safeName}`;
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: input.buffer,
        ContentType: input.mimeType || 'application/octet-stream',
      }),
    );
    const url = `${this.publicBase}/${key}`;
    return { url, key };
  }
}
