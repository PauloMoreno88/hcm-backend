import { Module } from '@nestjs/common';
import { VehiclesModule } from '../vehicles/vehicles.module';
import { MaintenancesController } from './maintenances.controller';
import { MaintenancesService } from './maintenances.service';
import { VehicleMaintenancesController } from './vehicle-maintenances.controller';

@Module({
  imports: [VehiclesModule],
  controllers: [MaintenancesController, VehicleMaintenancesController],
  providers: [MaintenancesService],
  exports: [MaintenancesService],
})
export class MaintenancesModule {}
