import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AdvantagesService } from './advantages.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('advantages')
export class AdvantagesController {
  constructor(private readonly advantagesService: AdvantagesService) {}

  @Get('public')
  async getPublicAdvantages(@Query('locale') locale: string) {
    return this.advantagesService.getPublicAdvantages(locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminAdvantages() {
    return this.advantagesService.getAdminAdvantages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async getAdminAdvantageById(@Param('id') id: string) {
    return this.advantagesService.getAdminAdvantageById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async createAdvantage(@Body() data: any) {
    return this.advantagesService.createAdvantage(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/sort')
  async updateSortOrder(@Body('ids') ids: string[]) {
    return this.advantagesService.updateSortOrder(ids);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  async updateAdvantage(@Param('id') id: string, @Body() data: any) {
    return this.advantagesService.updateAdvantage(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async deleteAdvantage(@Param('id') id: string) {
    return this.advantagesService.deleteAdvantage(id);
  }
}
