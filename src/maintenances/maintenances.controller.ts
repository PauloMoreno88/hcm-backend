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
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateMaintenanceDto } from './dto/update-maintenance.dto';
import { MaintenancesService } from './maintenances.service';

@Controller('maintenances')
export class MaintenancesController {
  constructor(private readonly maintenancesService: MaintenancesService) {}

  @Post()
  create(@CurrentUser() user: JwtUser, @Body() dto: CreateMaintenanceDto) {
    return this.maintenancesService.create(user.id, dto);
  }

  @Get(':id')
  findOne(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.maintenancesService.findOneForUser(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: JwtUser,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMaintenanceDto,
  ) {
    return this.maintenancesService.updateForUser(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: JwtUser, @Param('id', ParseUUIDPipe) id: string) {
    return this.maintenancesService.removeForUser(user.id, id);
  }
}
