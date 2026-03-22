import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
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
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaintenanceFileInputDto)
  files?: MaintenanceFileInputDto[];
}
