import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async vehicleMaintenanceReport(userId: string, vehicleId: string) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { id: vehicleId },
      include: {
        maintenances: {
          orderBy: { date: 'desc' },
          include: { files: true },
        },
      },
    });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found');
    }
    if (vehicle.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return {
      vehicle: {
        id: vehicle.id,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
        plate: vehicle.plate,
        nickname: vehicle.nickname,
        createdAt: vehicle.createdAt,
        updatedAt: vehicle.updatedAt,
      },
      maintenances: vehicle.maintenances.map((m) => ({
        id: m.id,
        type: m.type,
        description: m.description,
        km: m.km,
        price: m.price,
        date: m.date,
        createdAt: m.createdAt,
        files: m.files,
      })),
    };
  }
}
