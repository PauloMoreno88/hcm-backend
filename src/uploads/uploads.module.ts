import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStorage } from './storage/local.storage';
import { S3CompatibleStorage } from './storage/s3-compatible.storage';
import { STORAGE_PORT } from './storage/storage.port';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

@Module({
  imports: [ConfigModule],
  controllers: [UploadsController],
  providers: [
    UploadsService,
    {
      provide: STORAGE_PORT,
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('STORAGE_DRIVER', 'local');
        if (driver === 's3') {
          return new S3CompatibleStorage(config);
        }
        return new LocalStorage(config);
      },
      inject: [ConfigService],
    },
  ],
})
export class UploadsModule {}
