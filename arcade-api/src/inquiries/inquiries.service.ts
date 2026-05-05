import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { LocaleCode, LeadStatus, InquiryType } from '@prisma/client';
import { SiteSettingsService } from '../site-settings/site-settings.service';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SiteSettingsService
  ) {}

  async createInquiry(dto: CreateInquiryDto, type: string, userAgent?: string, ipAddress?: string) {
    // Basic structured data validation
    if (!dto.email && !dto.phone && !dto.whatsapp && !dto.wechat) {
      throw new BadRequestException('At least one contact method must be provided');
    }

    // Verify ReCAPTCHA
    const globalSettings: any = await this.settings.getSetting('global_options') || {};
    if (globalSettings.isRecaptchaEnabled === true || globalSettings.isRecaptchaEnabled === 'true') {
      const token = (dto as any).recaptchaToken;
      if (!token) throw new BadRequestException('ReCAPTCHA token is required');
      const secret = globalSettings.recaptchaSecretKey;
      if (secret) {
        const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: `secret=${secret}&response=${token}`
        });
        const data = await response.json();
        if (!data.success) throw new BadRequestException('Invalid ReCAPTCHA challenge');
      }
    }

    const inquiryTypeMap: Record<string, InquiryType> = {
      'CONTACT': InquiryType.GENERAL,
      'QUOTE': InquiryType.QUOTE,
      'PRODUCT': InquiryType.PRODUCT
    };

    const inquiry = await this.prisma.inquiry.create({
      data: {
        contactName: dto.contactName,
        companyName: dto.companyName,
        contactEmail: dto.email,
        contactPhone: dto.phone,
        contactWhatsapp: dto.whatsapp,
        contactWechat: dto.wechat,
        countryCode: dto.countryCode,
        locale: dto.locale as LocaleCode,
        inquiryType: inquiryTypeMap[type] || InquiryType.GENERAL,
        message: dto.message,
        utmSource: dto.sourceChannel || 'DIRECT',
        status: LeadStatus.NEW,
        userAgent,
        ipAddress,
        sessionDuration: dto.sessionDuration,
        pageViews: dto.pageViews,
        ...(dto.productId ? {
          product: { connect: { id: dto.productId } }
        } : {}),
      },
    });

    return { success: true, inquiryId: inquiry.id, message: 'Inquiry received' };
  }

  async getAdminInquiries() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });
  }
}

