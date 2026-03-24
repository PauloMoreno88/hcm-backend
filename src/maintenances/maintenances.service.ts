import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MaintenanceStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { VehiclesService } from '../vehicles/vehicles.service';
import type { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import type { UpdateMaintenanceDto } from './dto/update-maintenance.dto';

export function isMaintenanceCompleted(maintenance: { status: MaintenanceStatus }): boolean {
  return maintenance.status === MaintenanceStatus.DONE;
}

const maintenanceInclude = {
  files: true,
} as const;

@Injectable()
export class MaintenancesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(userId: string, dto: CreateMaintenanceDto) {
    await this.vehiclesService.assertVehicleOwnedByUser(userId, dto.vehicleId);
    const date = new Date(dto.date);
    const { files, ...rest } = dto;

    const maintenance = await this.prisma.$transaction(async (tx) => {
      return tx.maintenance.create({
        data: {
          vehicleId: rest.vehicleId,
          type: rest.type,
          description: rest.description,
          km: rest.km,
          price: rest.price ?? null,
          date,
          status: rest.status ?? MaintenanceStatus.TODO,
          files: files?.length
            ? {
                create: files.map((f) => ({
                  fileUrl: f.fileUrl,
                  fileType: f.fileType ?? null,
                })),
              }
            : undefined,
        },
        include: maintenanceInclude,
      });
    });

    await this.vehiclesService.computeHealthScore(userId, dto.vehicleId);

    return maintenance;
  }

  async findByVehicle(userId: string, vehicleId: string) {
    await this.vehiclesService.assertVehicleOwnedByUser(userId, vehicleId);
    return this.prisma.maintenance.findMany({
      where: { vehicleId, km: { not: 0 } },
      include: maintenanceInclude,
      orderBy: { date: 'desc' },
    });
  }

  async findOneForUser(userId: string, maintenanceId: string) {
    const maintenance = await this.prisma.maintenance.findUnique({
      where: { id: maintenanceId },
      include: { vehicle: true, files: true },
    });
    if (!maintenance || maintenance.km === 0) {
      throw new NotFoundException('Maintenance not found');
    }
    if (maintenance.vehicle.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return {
      id: maintenance.id,
      vehicleId: maintenance.vehicleId,
      type: maintenance.type,
      description: maintenance.description,
      km: maintenance.km,
      price: maintenance.price,
      date: maintenance.date,
      status: maintenance.status,
      createdAt: maintenance.createdAt,
      files: maintenance.files,
    };
  }

  async updateForUser(
    userId: string,
    maintenanceId: string,
    dto: UpdateMaintenanceDto,
  ) {
    const existing = await this.findOneForUser(userId, maintenanceId);
    const { files, date, ...rest } = dto;

    const isBeingCompleted =
      rest.status === MaintenanceStatus.DONE &&
      existing.status !== MaintenanceStatus.DONE;

    const resolvedDate = isBeingCompleted
      ? new Date()
      : date
        ? new Date(date)
        : undefined;

    const updated = await this.prisma.$transaction(async (tx) => {
      if (files !== undefined) {
        await tx.maintenanceFile.deleteMany({ where: { maintenanceId } });
      }

      return tx.maintenance.update({
        where: { id: maintenanceId },
        data: {
          ...rest,
          ...(resolvedDate ? { date: resolvedDate } : {}),
          ...(files !== undefined
            ? {
                files: {
                  create: files.map((f) => ({
                    fileUrl: f.fileUrl,
                    fileType: f.fileType ?? null,
                  })),
                },
              }
            : {}),
        },
        include: maintenanceInclude,
      });
    });

    await this.vehiclesService.computeHealthScore(userId, existing.vehicleId);

    return updated;
  }

  async removeForUser(userId: string, maintenanceId: string) {
    const maintenance = await this.findOneForUser(userId, maintenanceId);
    try {
      await this.prisma.maintenance.delete({ where: { id: maintenanceId } });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === 'P2025'
      ) {
        throw new NotFoundException('Maintenance not found');
      }
      throw e;
    }

    await this.vehiclesService.computeHealthScore(userId, maintenance.vehicleId);
  }
}
