import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceFileInputDto)
  files?: MaintenanceFileInputDto[];
}
