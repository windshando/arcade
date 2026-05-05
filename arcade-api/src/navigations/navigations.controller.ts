import { Controller, Get, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('navigations')
export class NavigationsController {
  constructor(private readonly navigationsService: NavigationsService) {}

  @Get('public/:key')
  getPublicMenu(
    @Param('key') key: string,
    @Query('locale') locale: string,
  ) {
    return this.navigationsService.getPublicMenu(key, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminMenus() {
    return this.navigationsService.getAdminMenus();
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:key')
  saveAdminMenu(@Param('key') key: string, @Body() data: { items: any[] }) {
    return this.navigationsService.saveAdminMenu(key, data.items);
  }
}
