import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocaleCode } from '@prisma/client';

@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get('public')
  async getPublicSlides(@Query('locale') locale: string) {
    return this.slidesService.getPublicSlides(locale);
  }


  @UseGuards(JwtAuthGuard)
  @Get('admin')
  async getAdminSlides() {
    return this.slidesService.getAdminSlides();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  async getAdminSlideById(@Param('id') id: string) {
    return this.slidesService.getAdminSlideById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  async createSlide(@Body() data: any) {
    return this.slidesService.createSlide(data);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/sort')
  async updateSortOrder(@Body('ids') ids: string[]) {
    return this.slidesService.updateSortOrder(ids);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  async updateSlide(@Param('id') id: string, @Body() data: any) {
    return this.slidesService.updateSlide(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  async deleteSlide(@Param('id') id: string) {
    return this.slidesService.deleteSlide(id);
  }
}
