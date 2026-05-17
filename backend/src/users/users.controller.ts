// users.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './user-role.enum';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

interface UpdateMeDto {
  name?: string;
  email?: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(
    @Body()
    body: {
      email: string;
      name: string;
      password: string;
      role: UserRole;
    },
  ) {
    return this.users.create(body);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.users.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.users.findById(req.user.userId);
  }

  // PATCH /users/me - úprava vlastného profilu
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateMe(@Request() req, @Body() updateDto: UpdateMeDto) {
    return this.users.update(req.user.userId, updateDto);
  }

  // PATCH /users/me/password - zmena hesla
  @UseGuards(JwtAuthGuard)
  @Patch('me/password')
  async updatePassword(@Request() req, @Body() passwordDto: ChangePasswordDto) {
    return this.users.updatePassword(req.user.userId, passwordDto);
  }

  // DELETE /users/me - zmazanie vlastného účtu
  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async deleteMe(@Request() req) {
    return this.users.delete(req.user.userId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  getById(@Param('id') id: string) {
    return this.users.findById(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; role?: UserRole },
  ) {
    return this.users.update(id, body);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.users.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('me/favs/:realityId')
  addFav(@Request() req, @Param('realityId') realityId: string) {
    return this.users.toggleFav(req.user.userId, realityId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me/favs/:realityId')
  removeFav(@Request() req, @Param('realityId') realityId: string) {
    return this.users.toggleFav(req.user.userId, realityId);
  }
}
