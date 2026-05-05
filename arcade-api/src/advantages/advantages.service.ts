import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode, ContentStatus } from '@prisma/client';

@Injectable()
export class AdvantagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicAdvantages(locale: string = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    const advantages = await this.prisma.advantage.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: { where: { locale: formattedLocale } },
      },
    });

    return advantages.map((adv) => {
      const t = adv.translations[0];
      return {
        id: adv.id,
        iconName: adv.iconName,
        title: t?.title || '',
        description: t?.description || '',
      };
    });
  }

  async getAdminAdvantages() {
    return this.prisma.advantage.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { translations: true },
    });
  }

  async getAdminAdvantageById(id: string) {
    const adv = await this.prisma.advantage.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!adv) throw new NotFoundException('Advantage not found');
    return adv;
  }

  async createAdvantage(data: any) {
    const { translations, ...baseData } = data;
    return this.prisma.advantage.create({
      data: {
        ...baseData,
        translations: {
          create: translations,
        },
      },
    });
  }

  async updateAdvantage(id: string, data: any) {
    const { translations, ...baseData } = data;
    
    return this.prisma.$transaction(async (prisma) => {
      const adv = await prisma.advantage.update({
        where: { id },
        data: baseData,
      });

      if (translations) {
        for (const t of translations) {
          await prisma.advantageTranslation.upsert({
            where: { advantageId_locale: { advantageId: id, locale: t.locale } },
            update: {
              title: t.title,
              description: t.description,
            },
            create: {
              ...t,
              advantageId: id,
            },
          });
        }
      }
      return prisma.advantage.findUnique({ 
        where: { id }, 
        include: { translations: true } 
      });
    });
  }

  async deleteAdvantage(id: string) {
    return this.prisma.advantage.delete({ where: { id } });
  }

  async updateSortOrder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.advantage.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }
}
