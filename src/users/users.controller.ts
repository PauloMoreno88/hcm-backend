import { Body, Controller, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtUser } from '../common/types/jwt-user';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getMe(@CurrentUser() user: JwtUser) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  updateMe(@CurrentUser() user: JwtUser, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(user.id, dto);
  }

  @Patch('preferences')
  updatePreferences(
    @CurrentUser() user: JwtUser,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    return this.usersService.updatePreferences(user.id, dto);
  }
}
