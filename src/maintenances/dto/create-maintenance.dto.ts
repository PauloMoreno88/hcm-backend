import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MaintenanceStatus } from '@prisma/client';

export class MaintenanceFileInputDto {
  @IsString()
  @MaxLength(2048)
  fileUrl: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  fileType?: string;
}

export class CreateMaintenanceDto {
  @IsUUID()
  vehicleId: string;

  @IsString()
  @MaxLength(120)
  type: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsInt()
  @Min(0)
  km: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceFileInputDto)
  files?: MaintenanceFileInputDto[];
}
