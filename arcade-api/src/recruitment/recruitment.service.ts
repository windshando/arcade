import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SiteSettingsService } from '../site-settings/site-settings.service';

@Injectable()
export class RecruitmentService {
  constructor(
    private prisma: PrismaService,
    private settings: SiteSettingsService
  ) {}

  async createJobApplication(data: any, ipAddress: string, userAgent?: string) {
    await this.verifyRecaptcha(data.recaptchaToken);
    
    // Remove the recaptchaToken from the payload before insertion
    const { recaptchaToken, ...insertData } = data;
    
    return this.prisma.jobApplication.create({
      data: {
        ...insertData,
        ipAddress,
        userAgent,
        sessionDuration: data.sessionDuration ? parseInt(data.sessionDuration) : undefined,
        pageViews: data.pageViews ? parseInt(data.pageViews) : undefined,
      }
    });
  }

  async getJobApplications() {
    return this.prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      include: { resumeMedia: true }
    });
  }

  async updateJobStatus(id: string, status: string) {
    return this.prisma.jobApplication.update({
      where: { id },
      data: { status }
    });
  }

  async createFranchiseApplication(data: any, ipAddress: string, userAgent?: string) {
    await this.verifyRecaptcha(data.recaptchaToken);
    
    const { recaptchaToken, ...insertData } = data;
    
    return this.prisma.franchiseApplication.create({
      data: {
        ...insertData,
        ipAddress,
        userAgent,
        sessionDuration: data.sessionDuration ? parseInt(data.sessionDuration) : undefined,
        pageViews: data.pageViews ? parseInt(data.pageViews) : undefined,
      }
    });
  }

  async getFranchiseApplications() {
    return this.prisma.franchiseApplication.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateFranchiseStatus(id: string, status: string) {
    return this.prisma.franchiseApplication.update({
      where: { id },
      data: { status }
    });
  }

  async verifyRecaptcha(token?: string) {
    const globalSettings: any = await this.settings.getSetting('global_options') || {};
    
    if (globalSettings.isRecaptchaEnabled === true || globalSettings.isRecaptchaEnabled === 'true') {
      if (!token) {
        throw new BadRequestException('ReCAPTCHA token is required');
      }
      
      const secret = globalSettings.recaptchaSecretKey;
      if (!secret) return; // if enabled but no secret, just bypass to not break production
      
      const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secret}&response=${token}`
      });
      
      const data = await response.json();
      if (!data.success) {
        throw new BadRequestException('Invalid ReCAPTCHA challenge');
      }
    }
  }

  async getPublicJobPostings(locale: string = 'EN') {
    return this.prisma.jobPosting.findMany({
      where: { status: 'PUBLISHED' },
      include: { translations: { where: { locale: locale as any } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAdminJobPostings() {
    return this.prisma.jobPosting.findMany({
      include: { translations: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getAdminJobPosting(id: string) {
    return this.prisma.jobPosting.findUnique({
      where: { id },
      include: { translations: true }
    });
  }

  async createJobPosting(data: any) {
    return this.prisma.jobPosting.create({
      data: {
        department: data.department,
        location: data.location,
        type: data.type,
        salaryRange: data.salaryRange,
        status: data.status,
        translations: { create: data.translations || [] }
      }
    });
  }

  async updateJobPosting(id: string, data: any) {
    if (data.translations && Array.isArray(data.translations)) {
      await this.prisma.$transaction(
        data.translations.map((t: any) =>
          this.prisma.jobPostingTranslation.upsert({
            where: { jobPostingId_locale: { jobPostingId: id, locale: t.locale } },
            update: { title: t.title, description: t.description, requirements: t.requirements },
            create: { jobPostingId: id, locale: t.locale, title: t.title, description: t.description, requirements: t.requirements }
          })
        )
      );
    }
    return this.prisma.jobPosting.update({
      where: { id },
      data: {
        ...(data.department !== undefined && { department: data.department }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.salaryRange !== undefined && { salaryRange: data.salaryRange }),
        ...(data.status !== undefined && { status: data.status }),
      }
    });
  }

  async deleteJobPosting(id: string) {
    return this.prisma.jobPosting.delete({ where: { id } });
  }
}
