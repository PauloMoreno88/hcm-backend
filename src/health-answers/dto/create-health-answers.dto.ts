import { Type } from 'class-transformer';
import { IsArray, IsEnum, ValidateNested } from 'class-validator';
import { HealthAnswerType, HealthAnswerValue } from '../health-answers.enums';

export class HealthAnswerItemDto {
  @IsEnum(HealthAnswerType)
  type: HealthAnswerType;

  @IsEnum(HealthAnswerValue)
  answer: HealthAnswerValue;
}

export class CreateHealthAnswersDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HealthAnswerItemDto)
  answers: HealthAnswerItemDto[];
}
