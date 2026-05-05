import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async getPublicCategories(locale: string = 'EN') {
    const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
    const categories = await this.prisma.productCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: {
          where: { locale: formattedLocale },
        },
      },
    });

    const coverMediaIds = categories.map(c => (c as any).coverMediaId).filter(Boolean);
    const mediaFiles = coverMediaIds.length > 0 ? await this.prisma.mediaFile.findMany({
      where: { id: { in: coverMediaIds } }
    }) : [];

    return categories.map((cat) => {
      const translation = cat.translations[0];
      const media = mediaFiles.find(m => m.id === (cat as any).coverMediaId);
      return {
        id: cat.id,
        slug: cat.slug,
        coverUrl: media ? `/api/v1/media/public/${media.storageKey}` : null,
        name: translation?.name || cat.slug,
        description: translation?.description || '',
      };
    });
  }

  async getAdminCategories() {
    return this.prisma.productCategory.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: true,
      },
    });
  }

  async createCategory(dto: any) {
    return this.prisma.productCategory.create({
      data: {
        slug: dto.slug,
        parentId: dto.parentId || null,
        sortOrder: dto.sortOrder || 0,
        isActive: dto.isActive !== false,
        coverMediaId: dto.coverMediaId || null,
        translations: dto.nameEn ? {
          create: {
            locale: 'EN',
            name: dto.nameEn,
            description: dto.description || null,
          }
        } : undefined,
      },
      include: { translations: true },
    });
  }

  async updateCategory(id: string, dto: any) {
    if (dto.nameEn) {
      await this.prisma.productCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: id, locale: 'EN' } },
        update: { name: dto.nameEn, description: dto.description || null },
        create: { categoryId: id, locale: 'EN', name: dto.nameEn, description: dto.description || null },
      });
    }

    return this.prisma.productCategory.update({
      where: { id },
      data: {
        slug: dto.slug,
        parentId: dto.parentId === null ? null : dto.parentId,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
      include: { translations: true },
    });
  }

  async deleteCategory(id: string) {
    // 1. Check if category includes any products
    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });
    if (productCount > 0) {
      throw new Error(`Cannot delete category because it contains ${productCount} products.`);
    }

    // 2. Check if category includes subcategories
    const childCount = await this.prisma.productCategory.count({
      where: { parentId: id },
    });
    if (childCount > 0) {
      throw new Error(`Cannot delete category because it contains ${childCount} subcategories.`);
    }

    // Safe to delete
    return this.prisma.productCategory.delete({
      where: { id },
    });
  }
}
