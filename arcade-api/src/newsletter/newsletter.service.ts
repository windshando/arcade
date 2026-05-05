import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);

  constructor(private prisma: PrismaService) {}

  // 1. PUBLIC SUBSCRIPTION — defaults to ALL topics
  async subscribe(email: string, topics?: string[]) {
    const finalTopics = (topics && topics.length > 0) ? topics : ['ALL'];
    // Upsert to handle seamless double-submissions safely
    return this.prisma.subscriber.upsert({
      where: { email },
      update: { topics: finalTopics, isActive: true },
      create: { email, topics: finalTopics }
    });
  }

  // 2. PUBLIC UNSUBSCRIBE — deactivate by token
  async unsubscribeByToken(token: string) {
    const sub = await this.prisma.subscriber.findUnique({
      where: { unsubscribeToken: token }
    });
    if (!sub) throw new NotFoundException('Invalid unsubscribe link');

    return this.prisma.subscriber.update({
      where: { id: sub.id },
      data: { isActive: false }
    });
  }

  // 3. PUBLIC — Update topic preferences by token (partial unsubscribe)
  async updatePreferencesByToken(token: string, topics: string[]) {
    const sub = await this.prisma.subscriber.findUnique({
      where: { unsubscribeToken: token }
    });
    if (!sub) throw new NotFoundException('Invalid link');

    return this.prisma.subscriber.update({
      where: { id: sub.id },
      data: { topics: topics.length > 0 ? topics : ['ALL'], isActive: true }
    });
  }

  // 4. PUBLIC — Get subscriber info by token (for the unsubscribe/preferences page)
  async getSubscriberByToken(token: string) {
    const sub = await this.prisma.subscriber.findUnique({
      where: { unsubscribeToken: token }
    });
    if (!sub) throw new NotFoundException('Invalid link');
    return {
      email: sub.email,
      topics: sub.topics,
      isActive: sub.isActive
    };
  }

  // 5. ADMIN LISTS
  async getSubscribers() {
    return this.prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getCampaigns() {
    return this.prisma.emailCampaign.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async getCampaignById(id: string) {
    return this.prisma.emailCampaign.findUnique({ where: { id } });
  }

  async saveCampaign(data: any) {
    if (data.id && data.id !== 'new') {
      return this.prisma.emailCampaign.update({
        where: { id: data.id },
        data: {
          subject: data.subject,
          bodyHtml: data.bodyHtml,
          targetTopics: data.targetTopics,
          status: data.status,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        }
      });
    } else {
      return this.prisma.emailCampaign.create({
        data: {
          subject: data.subject,
          bodyHtml: data.bodyHtml,
          targetTopics: data.targetTopics,
          status: data.status,
          scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
        }
      });
    }
  }

  // 6. SETTINGS
  async getMailgunSettings() {
    const setting = await this.prisma.siteSetting.findUnique({ where: { settingKey: 'MAILGUN_CONFIG' } });
    return setting ? setting.settingValue : { apiKey: '', domain: '', fromEmail: '' };
  }

  async saveMailgunSettings(data: { apiKey: string, domain: string, fromEmail: string }) {
    return this.prisma.siteSetting.upsert({
      where: { settingKey: 'MAILGUN_CONFIG' },
      update: { settingValue: data as any },
      create: { settingKey: 'MAILGUN_CONFIG', settingValue: data as any }
    });
  }

  // 7. CRON JOB DISPATCHER
  @Cron(CronExpression.EVERY_MINUTE)
  async handleScheduledCampaigns() {
    // Find all scheduled campaigns where the time has passed
    const campaigns = await this.prisma.emailCampaign.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledFor: { lte: new Date() }
      }
    });

    if (campaigns.length === 0) return;

    const settings = await this.getMailgunSettings() as any;
    if (!settings.apiKey || !settings.domain) {
      this.logger.error('Mailgun settings missing! Cannot dispatch scheduled emails.');
      return;
    }

    for (const campaign of campaigns) {
      await this.dispatchCampaign(campaign, settings);
    }
  }

  private async dispatchCampaign(campaign: any, settings: any) {
    // Lock campaign
    await this.prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { status: 'SENDING' }
    });

    // Query targets
    let queryOptions: any = { isActive: true };
    if (!campaign.targetTopics.includes('ALL')) {
       queryOptions.topics = { hasSome: campaign.targetTopics };
    }
    const targets = await this.prisma.subscriber.findMany({ where: queryOptions });

    if (targets.length === 0) {
      await this.prisma.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: 'COMPLETED', totalTargets: 0, sentAt: new Date() }
      });
      return;
    }

    let successCount = 0;
    let failCount = 0;

    const siteUrl = process.env.SITE_URL || 'http://localhost:3000';
    const url = `https://api.mailgun.net/v3/${settings.domain}/messages`;
    const authHeader = 'Basic ' + Buffer.from(`api:${settings.apiKey}`).toString('base64');

    for (const sub of targets) {
      const unsubscribeUrl = `${siteUrl}/en/unsubscribe?token=${sub.unsubscribeToken}`;

      // Append unsubscribe footer to email body
      const bodyWithFooter = campaign.bodyHtml + `
        <div style="margin-top:40px;padding-top:20px;border-top:1px solid #eee;font-size:12px;color:#888;text-align:center">
          <p>You're receiving this because you subscribed to our newsletter.</p>
          <p><a href="${unsubscribeUrl}" style="color:#888;text-decoration:underline">Manage preferences or unsubscribe</a></p>
        </div>`;

      const formData = new URLSearchParams();
      formData.append('from', settings.fromEmail || `no-reply@${settings.domain}`);
      formData.append('to', sub.email);
      formData.append('subject', campaign.subject);
      formData.append('html', bodyWithFooter);
      // Tagging for webhooks
      formData.append('v:campaign_id', campaign.id); 
      formData.append('o:tracking', 'yes');
      formData.append('o:tracking-opens', 'yes');
      // Add List-Unsubscribe header for email clients
      formData.append('h:List-Unsubscribe', `<${unsubscribeUrl}>`);

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
             'Authorization': authHeader,
             'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (e) {
        failCount++;
      }
    }

    await this.prisma.emailCampaign.update({
      where: { id: campaign.id },
      data: { 
        status: 'COMPLETED', 
        totalTargets: targets.length,
        totalSent: successCount,
        totalFailed: failCount,
        sentAt: new Date()
      }
    });

    this.logger.log(`Campaign ${campaign.id} Completed! Sent: ${successCount}, Failed: ${failCount}`);
  }

  // 8. WEBHOOK PROCESSOR
  async processWebhook(payload: any) {
    if (!payload || !payload['event-data']) return { status: 'ignored' };
    
    // Validate signature securely here in production...
    
    const eventData = payload['event-data'];
    const event = eventData.event;
    const userVariables = eventData['user-variables'];

    if (!userVariables || !userVariables.campaign_id) return { status: 'no_campaign_id' };

    const campaignId = userVariables.campaign_id;
    
    if (event === 'opened') {
      await this.prisma.emailCampaign.updateMany({
        where: { id: campaignId },
        data: { totalOpened: { increment: 1 } }
      });
    } else if (event === 'clicked') {
      await this.prisma.emailCampaign.updateMany({
        where: { id: campaignId },
        data: { totalClicked: { increment: 1 } }
      });
    }

    return { status: 'tracked' };
  }
}
