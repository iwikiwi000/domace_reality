// src/offers/offers.controller.ts
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser, type JwtUser } from 'src/auth/current-user.decorator';
import { ZodPipe } from 'src/core/zod.pipe';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/user-role.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { OffersService } from './offers.service';
import { CreateOfferSchema, type CreateOfferDto } from './offers.dto';

@Controller('offers')
@UseGuards(AuthGuard('jwt'))
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post(':nehnutelnostId')
  create(
    @Param('nehnutelnostId') nehnutelnostId: string,
    @CurrentUser() user: JwtUser,
    @Body(new ZodPipe(CreateOfferSchema)) body: CreateOfferDto,
  ) {
    return this.offersService.create(nehnutelnostId, user.userId, body);
  }

  @Get('my')
  getMyOffers(@CurrentUser() user: JwtUser) {
    return this.offersService.findByBuyer(user.userId);
  }

  @Get('received')
  getReceivedOffers(@CurrentUser() user: JwtUser) {
    return this.offersService.findReceived(user.userId);
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  getAll() {
    return this.offersService.findAll();
  }
}
