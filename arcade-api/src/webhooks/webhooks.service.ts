import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebhooksService {
  constructor(private readonly prisma: PrismaService) {}

  async handleMailgunIncoming(payload: any) {
    const sender = payload.sender; // e.g. "customer@example.com"
    const subject = payload.subject;
    const bodyPlain = payload['body-plain'];

    if (!sender) return { status: 'ignored, no sender' };

    // Find the most recent inquiry for this specific customer email
    const mostRecentInquiry = await this.prisma.inquiry.findFirst({
      where: { contactEmail: sender },
      orderBy: { createdAt: 'desc' },
    });

    if (!mostRecentInquiry) {
      // If we don't recognize the email, it ignores it. 
      return { status: 'ignored, email does not match any existing leads' };
    }

    // Inject exact email record into timeline
    await this.prisma.leadActivity.create({
      data: {
        inquiryId: mostRecentInquiry.id,
        activityType: 'EMAIL_RECEIVED',
        summary: `Email Received: ${subject || 'No Subject'}`,
        metadataJson: {
          sender,
          bodyPlain,
        },
      },
    });

    return { status: 'success' };
  }
}
