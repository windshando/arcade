import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { SiteSettingsService } from './site-settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('settings')
export class SiteSettingsController {
  constructor(private readonly siteSettingsService: SiteSettingsService) {}

  @Get('public')
  getPublicSettings() {
    return this.siteSettingsService.getPublicSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminSettings() {
    return this.siteSettingsService.getAllSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  updateAdminSetting(@Body() body: { key: string, value: any }) {
    return this.siteSettingsService.updateSetting(body.key, body.value);
  }
}
