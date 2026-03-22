import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/jwt-user';
import { MaintenancesService } from './maintenances.service';

@Controller('vehicles')
export class VehicleMaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Get(':vehicleId/maintenances')
  findByVehicle(
    @CurrentUser() user: JwtUser,
    @Param('vehicleId', ParseUUIDPipe) vehicleId: string,
  ) {
    return this.maintenancesService.findByVehicle(user.id, vehicleId);
  }
}
