import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateVehicleDto } from './dto/create-vehicle.dto';
import type { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { calculateHealthScore } from './health-score/health-score.calculator';

@Injectable()
export class VehiclesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateVehicleDto) {
    return this.prisma.vehicle.create({
      data: { ...dto, userId },
    });
  }

  async findAllForUser(userId: string) {
    return this.prisma.vehicle.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (vehicle.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return vehicle;
  }

  async updateForUser(
    userId: string,
    vehicleId: string,
    dto: UpdateVehicleDto,
  ) {
    await this.findOneForUser(userId, vehicleId);
    try {
      return await this.prisma.vehicle.update({
        where: { id: vehicleId },
        data: dto,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Vehicle not found');
      }
      throw e;
    }
  }

  async removeForUser(userId: string, vehicleId: string) {
    await this.findOneForUser(userId, vehicleId);
    await this.prisma.vehicle.delete({ where: { id: vehicleId } });
  }

  async assertVehicleOwnedByUser(
    userId: string,
    vehicleId: string,
  ): Promise<void> {
    await this.findOneForUser(userId, vehicleId);
  }

  async computeHealthScore(userId: string, vehicleId: string) {
    const now = new Date();

    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        maintenances: {
          where: { date: { lte: now } },
        },
      },
    });

    if (!vehicle) throw new NotFoundException('Vehicle not found');
    if (vehicle.userId !== userId) throw new ForbiddenException('Access denied');

    const result = calculateHealthScore({
      currentKm: vehicle.odometer,
      maintenances: vehicle.maintenances.map((m) => ({
        type: m.type,
        km: m.km,
        date: m.date,
      })),
    });

    await this.prisma.vehicle.update({
      where: { id: vehicleId },
      data: { healthScore: result.score },
    });

    return result;
  }
}
