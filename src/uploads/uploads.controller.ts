import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadsService } from './uploads.service';

const maxFileSizeBytes = 10 * 1024 * 1024;

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: maxFileSizeBytes },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File | undefined) {
    if (!file?.buffer) {
      throw new BadRequestException('File is required');
    }
    return this.uploadsService.uploadFile({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });
  }
}
