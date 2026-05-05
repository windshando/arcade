import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { StaticPagesService } from './static-pages.service';
import { LocaleCode } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('pages')
export class StaticPagesController {
  constructor(private readonly staticPagesService: StaticPagesService) {}

  @Get('public/:slug')
  getPublicPage(
    @Param('slug') slug: string,
    @Query('locale') locale: LocaleCode,
  ) {
    return this.staticPagesService.getPublicPage(slug, locale);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminPages() {
    return this.staticPagesService.getAdminPages();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  getAdminPage(@Param('id') id: string) {
    return this.staticPagesService.getAdminPage(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  createAdminPage(@Body() body: any) {
    return this.staticPagesService.createAdminPage(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put('admin/:id')
  updateAdminPage(@Param('id') id: string, @Body() body: any) {
    return this.staticPagesService.updateAdminPage(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('admin/:id')
  deleteAdminPage(@Param('id') id: string) {
    return this.staticPagesService.deleteAdminPage(id);
  }
}
