import { Controller, Get, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FaqService } from './faq.service';
import { LocaleCode } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('faq')
export class FaqController {
  constructor(private readonly faqService: FaqService) {}

  @Get('public')
  getPublicFaqs(@Query('locale') locale: LocaleCode) {
    // If no locale is provided, default to EN
    return this.faqService.getPublicFaqs(locale || 'EN');
  }

  @Post('public/:id/vote')
  voteFaq(
    @Param('id') id: string,
    @Body() body: { voteType: 'UP' | 'DOWN' }
  ) {
    return this.faqService.voteFaq(id, body.voteType);
  }

  // Admin Endpoints
  @UseGuards(JwtAuthGuard)
  @Get('admin')
  getAdminFaqs() {
    return this.faqService.getAdminFaqs();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/category')
  createCategory(@Body() body: { slug: string, name: string }) {
    return this.faqService.createCategory(body.slug, body.name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin')
  createFaq(@Body() body: { categoryId: string, question: string, answer: string }) {
    return this.faqService.createFaq(body.categoryId, body.question, body.answer);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/category/:id')
  getAdminCategoryById(@Param('id') id: string) {
    return this.faqService.getAdminCategoryById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/faq/:id')
  getAdminFaqById(@Param('id') id: string) {
    return this.faqService.getAdminFaqById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/category/:id')
  updateCategory(
    @Param('id') id: string,
    @Body() body: { slug: string, name: string, isActive: boolean }
  ) {
    return this.faqService.updateCategory(id, body.slug, body.name, body.isActive);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/faq/:id')
  updateFaq(
    @Param('id') id: string,
    @Body() body: { categoryId: string, status: any, question: string, answer: string }
  ) {
    return this.faqService.updateFaq(id, body.categoryId, body.status, body.question, body.answer);
  }
}
