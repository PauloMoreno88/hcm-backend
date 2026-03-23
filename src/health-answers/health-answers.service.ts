import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import { calculateAnswerBasedScore } from './health-answers.calculator';
import type { HealthAnswerItemDto } from './dto/create-health-answers.dto';

@Injectable()
export class HealthAnswersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async upsertAnswers(
    userId: string,
    vehicleId: string,
    answers: HealthAnswerItemDto[],
  ) {
    await this.vehiclesService.assertVehicleOwnedByUser(userId, vehicleId);

    const upserts = answers.map((item) =>
      this.prisma.vehicleHealthAnswer.upsert({
        where: { vehicleId_type: { vehicleId, type: item.type } },
        create: { vehicleId, type: item.type, answer: item.answer },
        update: { answer: item.answer },
      }),
    );

    const saved = await Promise.all(upserts);

    // Fetch all answers for this vehicle (including ones not submitted now)
    const allAnswers = await this.prisma.vehicleHealthAnswer.findMany({
      where: { vehicleId },
    });

    const score = calculateAnswerBasedScore(allAnswers);

    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { healthScore: score },
    });

    return saved;
  }

  async findByVehicle(userId: string, vehicleId: string) {
    console.log('findByVehicle', userId, vehicleId);
    await this.vehiclesService.assertVehicleOwnedByUser(userId, vehicleId);
    return this.prisma.vehicleHealthAnswer.findMany({ where: { vehicleId } });
  }
}
