import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode, ContentStatus } from '@prisma/client';

@Injectable()
export class SlidesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getMediaBaseUrl(): string {
    return this.configService.get<string>('API_BASE_URL') || 'http://localhost:3001/api/v1';
  }

  async getPublicSlides(locale: string = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    const slides = await this.prisma.heroSlide.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: { where: { locale: formattedLocale } },
        desktopMedia: true,
        mobileMedia: true,
      },
    });

    const apiUrl = this.getMediaBaseUrl();

    return slides.map((slide) => {
      const t = slide.translations[0];
      return {
        id: slide.id,
        desktopImageUrl: slide.desktopMedia ? `${apiUrl}/media/public/${slide.desktopMedia.storageKey}` : null,
        mobileImageUrl: slide.mobileMedia ? `${apiUrl}/media/public/${slide.mobileMedia.storageKey}` : null,
        url: slide.url,
        layoutStyle: slide.layoutStyle,
        buttonStyle: slide.buttonStyle,
        title: t?.title || '',
        subtitle: t?.subtitle || '',
        ctaText: t?.ctaText || '',
      };
    });
  }

  async getAdminSlides() {
    return this.prisma.heroSlide.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { 
        translations: true,
        desktopMedia: true,
        mobileMedia: true,
      },
    });
  }

  async getAdminSlideById(id: string) {
    const slide = await this.prisma.heroSlide.findUnique({
      where: { id },
      include: {
        translations: true,
        desktopMedia: true,
        mobileMedia: true,
      },
    });
    if (!slide) throw new NotFoundException('Slide not found');
    return slide;
  }

  async createSlide(data: any) {
    const { translations, ...baseData } = data;
    return this.prisma.heroSlide.create({
      data: {
        ...baseData,
        translations: {
          create: translations,
        },
      },
    });
  }

  async updateSlide(id: string, data: any) {
    const { translations, ...baseData } = data;
    
    return this.prisma.$transaction(async (prisma) => {
      const slide = await prisma.heroSlide.update({
        where: { id },
        data: baseData,
      });

      if (translations) {
        for (const t of translations) {
          await prisma.heroSlideTranslation.upsert({
            where: { slideId_locale: { slideId: id, locale: t.locale } },
            update: {
              title: t.title,
              subtitle: t.subtitle,
              ctaText: t.ctaText,
            },
            create: {
              ...t,
              slideId: id,
            },
          });
        }
      }
      return prisma.heroSlide.findUnique({ 
        where: { id }, 
        include: { translations: true, desktopMedia: true, mobileMedia: true } 
      });
    });
  }

  async deleteSlide(id: string) {
    return this.prisma.heroSlide.delete({ where: { id } });
  }

  async updateSortOrder(ids: string[]) {
    return this.prisma.$transaction(
      ids.map((id, index) =>
        this.prisma.heroSlide.update({
          where: { id },
          data: { sortOrder: index },
        }),
      ),
    );
  }
}
