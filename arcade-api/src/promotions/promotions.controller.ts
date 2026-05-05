import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  // PUBLIC ENDPOINT FOR LANDING PAGE (AND VIEW TRACKING)
  @Get('public/:slug')
  getPublicPromotion(@Param('slug') slug: string) {
    return this.promotionsService.getPublicPromotion(slug);
  }

  // ADMIN ENDPOINTS
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminPromotions() {
    return this.promotionsService.getAdminPromotions();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/:id')
  getAdminPromotionById(@Param('id') id: string) {
    return this.promotionsService.getAdminPromotionById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  saveAdminPromotion(@Body() body: any) {
    return this.promotionsService.saveAdminPromotion(body);
  }
}
