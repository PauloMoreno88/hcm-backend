import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPreferencesDto {
  @IsOptional()
  @IsBoolean()
  healthScoreEnabled?: boolean;
}
