import { Controller, Post, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('mailgun')
  async handleMailgun(
    @Body() body: any,
    @Headers('authorization') authHeader: string
  ) {
    // Signature verification is now handled in newsletterService.processWebhook
    
    return this.webhooksService.handleMailgunIncoming(body);
  }
}
