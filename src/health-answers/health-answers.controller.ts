import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/jwt-user';
import { CreateHealthAnswersDto } from './dto/create-health-answers.dto';
import { HealthAnswersService } from './health-answers.service';

@Controller('vehicles/:vehicleId/health-answers')
export class HealthAnswersController {
  constructor(private readonly healthAnswersService: HealthAnswersService) {}

  @Post()
  upsert(
    @CurrentUser() user: JwtUser,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
    @Body() dto: CreateHealthAnswersDto,
  ) {
    return this.healthAnswersService.upsertAnswers(user.id, vehicleId, dto.answers);
  }

  @Get()
  findAll(
    @CurrentUser() user: JwtUser,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return this.healthAnswersService.findByVehicle(user.id, vehicleId);
  }
}
