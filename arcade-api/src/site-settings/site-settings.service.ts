import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicSettings() {
    const settings = await this.prisma.siteSetting.findMany({
      where: {
        settingKey: {
          in: ['site.brand', 'site.contact', 'site.seo.defaults', 'global_options'],
        },
      },
    });
    
    return settings.reduce((acc, curr) => {
      let val = curr.settingValue;
      if (curr.settingKey === 'global_options') {
        // Strip sensitive keys!
        const { recaptchaSecretKey, ...safeOps } = val as any;
        val = safeOps;
      }
      acc[curr.settingKey] = val;
      return acc;
    }, {} as Record<string, any>);
  }

  async getAllSettings() {
    return this.prisma.siteSetting.findMany();
  }

  async getSetting(key: string) {
    const setting = await this.prisma.siteSetting.findUnique({ where: { settingKey: key } });
    return setting?.settingValue || {};
  }

  async updateSetting(key: string, value: any) {
    return this.prisma.siteSetting.upsert({
      where: { settingKey: key },
      update: { settingValue: value },
      create: { settingKey: key, settingValue: value },
    });
  }
}
