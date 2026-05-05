import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';

@Injectable()
export class StaticPagesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicPage(slug: string, locale: LocaleCode = 'EN') {
    const page = await this.prisma.staticPage.findUnique({
      where: { pageKey: slug },
      include: {
        translations: { where: { locale } },
      },
    });

    if (!page || page.status !== 'PUBLISHED') throw new NotFoundException();

    const t = page.translations[0];
    return {
      id: page.id,
      slug: page.pageKey,
      title: t?.title || page.pageKey,
      content: t?.content || '',
      seoTitle: t?.seoTitle,
      seoDescription: t?.seoDescription,
    };
  }

  async getAdminPages() {
    return this.prisma.staticPage.findMany({
      orderBy: { createdAt: 'desc' },
      include: { translations: true },
    });
  }

  async getAdminPage(id: string) {
    const page = await this.prisma.staticPage.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!page) throw new NotFoundException();
    return page;
  }

  async createAdminPage(data: any) {
    return this.prisma.staticPage.create({
      data: {
        pageKey: data.pageKey,
        status: data.status || 'DRAFT',
        translations: {
          create: data.translations || [],
        },
      },
      include: { translations: true },
    });
  }

  async updateAdminPage(id: string, data: any) {
    if (data.translations && Array.isArray(data.translations)) {
      await this.prisma.$transaction(
        data.translations.map((t: any) =>
          this.prisma.staticPageTranslation.upsert({
            where: {
              pageId_locale: { pageId: id, locale: t.locale },
            },
            update: {
              title: t.title,
              content: t.content,
              seoTitle: t.seoTitle,
              seoDescription: t.seoDescription,
            },
            create: {
              pageId: id,
              locale: t.locale,
              title: t.title,
              content: t.content,
              seoTitle: t.seoTitle,
              seoDescription: t.seoDescription,
            },
          })
        )
      );
    }

    return this.prisma.staticPage.update({
      where: { id },
      data: {
        ...(data.pageKey && { pageKey: data.pageKey }),
        ...(data.status && { status: data.status }),
      },
      include: { translations: true },
    });
  }

  async deleteAdminPage(id: string) {
    return this.prisma.staticPage.delete({
      where: { id },
    });
  }
}
