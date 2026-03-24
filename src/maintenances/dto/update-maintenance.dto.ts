import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { MaintenanceStatus } from '@prisma/client';
import { MaintenanceFileInputDto } from './create-maintenance.dto';

export class UpdateMaintenanceDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  type?: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  km?: number;

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceFileInputDto)
  files?: MaintenanceFileInputDto[];
}
