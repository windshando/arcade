import { Controller, Get, Post, Body, Param, Query, UseGuards, HttpCode } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  // PUBLIC ENDPOINTS
  @Post('public/subscribe')
  subscribe(@Body() body: { email: string, topics?: string[] }) {
    return this.newsletterService.subscribe(body.email, body.topics);
  }

  // PUBLIC — Get subscriber info by unsubscribe token (for the preferences page)
  @Get('public/unsubscribe')
  getSubscriberByToken(@Query('token') token: string) {
    return this.newsletterService.getSubscriberByToken(token);
  }

  // PUBLIC — Fully unsubscribe by token
  @Post('public/unsubscribe')
  @HttpCode(200)
  unsubscribe(@Body() body: { token: string }) {
    return this.newsletterService.unsubscribeByToken(body.token);
  }

  // PUBLIC — Update topic preferences by token
  @Post('public/preferences')
  @HttpCode(200)
  updatePreferences(@Body() body: { token: string, topics: string[] }) {
    return this.newsletterService.updatePreferencesByToken(body.token, body.topics);
  }

  // PUBLIC WEBHOOK FOR MAILGUN
  @Post('public/webhooks/mailgun')
  @HttpCode(200)
  handleMailgunWebhook(@Body() payload: any) {
    return this.newsletterService.processWebhook(payload);
  }

  // ADMIN ENDPOINTS
  @UseGuards(JwtAuthGuard)
  @Get('admin/subscribers')
  getSubscribers() {
    return this.newsletterService.getSubscribers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/campaigns')
  getCampaigns() {
    return this.newsletterService.getCampaigns();
  }

  @UseGuards(JwtAuthGuard)
  @Get('admin/campaign/:id')
  getCampaignById(@Param('id') id: string) {
    return this.newsletterService.getCampaignById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/campaign')
  saveCampaign(@Body() body: any) {
    return this.newsletterService.saveCampaign(body);
  }
  
  @UseGuards(JwtAuthGuard)
  @Get('admin/settings')
  getMailgunSettings() {
    return this.newsletterService.getMailgunSettings();
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/settings')
  saveMailgunSettings(@Body() body: { apiKey: string, domain: string, fromEmail: string }) {
    return this.newsletterService.saveMailgunSettings(body);
  }
}
