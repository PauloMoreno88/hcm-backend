import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  brand?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  model?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  year?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  plate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  nickname?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  odometer?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  healthScore?: number;
}
