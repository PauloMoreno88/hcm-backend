import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { HealthAnswersController } from './health-answers.controller';
import { HealthAnswersService } from './health-answers.service';

@Module({
  imports: [PrismaModule, VehiclesModule],
  controllers: [HealthAnswersController],
  providers: [HealthAnswersService],
  exports: [HealthAnswersService],
})
export class HealthAnswersModule {}
