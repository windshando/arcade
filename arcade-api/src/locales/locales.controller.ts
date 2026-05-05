import { Controller, Get, UseGuards } from '@nestjs/common';
import { LocalesService } from './locales.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('locales')
export class LocalesController {
  constructor(private readonly localesService: LocalesService) {}

  @Get('public')
  getPublicLocales() {
    return this.localesService.getEnabledLocales();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminLocales() {
    return this.localesService.getAllLocales();
  }
}
