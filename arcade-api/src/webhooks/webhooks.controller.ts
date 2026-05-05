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
    // TODO: Verify Mailgun signature or token here once configured securely.
    // Example: if (authHeader !== `Bearer ${process.env.MAILGUN_SECRET}`) throw new UnauthorizedException();
    
    return this.webhooksService.handleMailgunIncoming(body);
  }
}
