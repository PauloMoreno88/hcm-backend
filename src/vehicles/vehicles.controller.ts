import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/jwt-user';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehiclesService } from './vehicles.service';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateVehicleDto) {
    return this.vehiclesService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: JwtUser) {
    return this.vehiclesService.findAllForUser(user.id);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.vehiclesService.findOneForUser(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.updateForUser(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.vehiclesService.removeForUser(user.id, id);
  }

  @Get(':id/health-score')
  healthScore(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.vehiclesService.computeHealthScore(user.id, id);
  }
}
