import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode, ContentStatus } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private getMediaBaseUrl(): string {
    return this.configService.get<string>('API_BASE_URL') || 'http://localhost:3001/api/v1';
  }

  async getPublicProducts(locale: string = 'EN', categorySlug?: string, isFeatured?: string) {
    try {
      const formattedLocale = (locale || 'EN').replace('-', '_').toUpperCase() as LocaleCode;
      const products = await this.prisma.product.findMany({
        where: {
          status: 'PUBLISHED',
          ...(categorySlug ? { category: { slug: categorySlug } } : {}),
          ...(isFeatured === 'true' ? { isFeatured: true } : {}),
        },
        orderBy: { sortOrder: 'asc' },
        include: {
          category: true,
          translations: {
            where: { locale: formattedLocale },
          },
          mediaItems: {
            include: { mediaFile: true },
            orderBy: { sortOrder: 'asc' },
          },
        },
      });

      return products.map((prod) => {
        const translation = prod.translations[0];
        return {
          id: prod.id,
          slug: prod.slug,
          sku: prod.sku,
          category: prod.category?.slug || 'uncategorized',
          name: translation?.name || prod.slug,
          shortDescription: translation?.shortDescription || '',
          basePrice: prod.basePrice,
          baseCurrency: prod.baseCurrency,
          isFeatured: prod.isFeatured,
          media: prod.mediaItems.map((m) => ({
            url: `${this.getMediaBaseUrl()}/media/public/${m.mediaFile.storageKey}`,
            type: m.mediaFile.mimeType,
            isPrimary: m.isPrimary,
          })),
        };
      });
    } catch (error: any) {
      console.error("DEBUG Prisma Error:", error);
      throw new ConflictException(error?.message || 'Unknown debug error');
    }
  }

  async getPublicProductDetail(slug: string, locale: LocaleCode = 'EN') {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        translations: { where: { locale } },
        specs: { where: { locale } },
        customizationOptions: { where: { locale } },
        mediaItems: { include: { mediaFile: true } },
      },
    });

    if (!product || product.status !== 'PUBLISHED') {
      throw new NotFoundException('Product not found or not published');
    }

    const t = product.translations[0];
    return {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      category: product.category.slug,
      name: t?.name || product.slug,
      description: t?.description || '',
      shortDescription: t?.shortDescription || '',
      basePrice: product.basePrice,
      baseCurrency: product.baseCurrency,
      seoTitle: t?.seoTitle || '',
      seoDescription: t?.seoDescription || '',
      isFeatured: product.isFeatured,
      voltage: product.voltage,
      powerConsumption: product.powerConsumption,
      dimensions: product.dimensions,
      weight: product.weight,
      playerCount: product.playerCount,
      moq: product.moq,
      leadTimeDays: product.leadTimeDays,
      warrantyMonths: product.warrantyMonths,
      targetVenue: product.targetVenue,
      customizationEnabled: product.customizationEnabled,
      specs: product.specs.map(s => ({ key: s.specKey, value: s.specValue })),
      customizationOptions: product.customizationOptions.map(c => ({ key: c.optionKey, value: c.optionValue })),
      media: product.mediaItems.map((m) => ({
        url: `${this.getMediaBaseUrl()}/media/public/${m.mediaFile.storageKey}`,
        type: m.mediaFile.mimeType,
        isPrimary: m.isPrimary,
      })),
    };
  }

  async getAdminProductById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        translations: true,
        specs: { orderBy: { sortOrder: 'asc' } },
        customizationOptions: { orderBy: { sortOrder: 'asc' } },
        mediaItems: {
          orderBy: { sortOrder: 'asc' },
          include: { mediaFile: true }
        }
      }
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async getAdminProducts() {
    return this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        translations: true,
        mediaItems: {
          include: { mediaFile: true },
          orderBy: { sortOrder: 'asc' }
        }
      },
    });
  }

  async createProduct(dto: CreateProductDto) {
    const existing = await this.prisma.product.findUnique({
      where: { slug: dto.slug }
    });
    if (existing) {
      throw new ConflictException('Product with this slug already exists');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Create Base Product
      const product = await prisma.product.create({
        data: {
          slug: dto.slug,
          sku: dto.sku,
          categoryId: dto.categoryId,
          status: 'DRAFT',
          isFeatured: dto.isFeatured || false,
          voltage: dto.voltage,
          dimensions: dto.dimensions,
          weight: dto.weight,
          playerCount: dto.playerCount,
          moq: dto.moq,
          leadTimeDays: dto.leadTimeDays,
          warrantyMonths: dto.warrantyMonths,
        }
      });

      // Stub localized versions based on English input
      const locales: LocaleCode[] = ['EN', 'ZH_CN', 'JA', 'AR'];
      for (const locale of locales) {
        const prefix = locale === 'EN' ? '' : `[${locale}] `;
        await prisma.productTranslation.create({
          data: {
            productId: product.id,
            locale,
            name: `${prefix}${dto.name}`,
            shortDescription: dto.shortDescription ? `${prefix}${dto.shortDescription}` : undefined,
            description: dto.description ? `${prefix}${dto.description}` : undefined,
          }
        });

        // Add specs for each locale
        if (dto.specs && dto.specs.length > 0) {
          let sortOrder = 0;
          for (const s of dto.specs) {
            await prisma.productSpec.create({
              data: {
                productId: product.id,
                locale,
                specKey: `${prefix}${s.key}`,
                specValue: `${prefix}${s.value}`,
                sortOrder: sortOrder++
              }
            });
          }
        }

        // Add custom options for each locale
        if (dto.customizationOptions && dto.customizationOptions.length > 0) {
          let sortOrder = 0;
          for (const o of dto.customizationOptions) {
            await prisma.productCustomizationOption.create({
              data: {
                productId: product.id,
                locale,
                optionKey: `${prefix}${o.key}`,
                optionValue: `${prefix}${o.value}`,
                sortOrder: sortOrder++
              }
            });
          }
        }
      }

      // Link Media
      if (dto.mediaIds && dto.mediaIds.length > 0) {
        let sortOrder = 0;
        for (const mediaId of dto.mediaIds) {
          await prisma.productMedia.create({
            data: {
              productId: product.id,
              mediaFileId: mediaId,
              sortOrder: sortOrder++,
              isPrimary: sortOrder === 1, // First item is primary
            }
          });
        }
      }

      return product;
    });
  }

  async updateProduct(id: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');

    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.prisma.product.findUnique({ where: { slug: dto.slug } });
      if (existing) throw new ConflictException('Slug already taken');
    }

    return this.prisma.$transaction(async (prisma) => {
      // Update Base Product
      const updated = await prisma.product.update({
        where: { id },
        data: {
          slug: dto.slug,
          sku: dto.sku,
          categoryId: dto.categoryId,
          status: dto.status as ContentStatus,
          isFeatured: dto.isFeatured,
          voltage: dto.voltage,
          dimensions: dto.dimensions,
          weight: dto.weight,
          playerCount: dto.playerCount,
          moq: dto.moq,
          leadTimeDays: dto.leadTimeDays,
          warrantyMonths: dto.warrantyMonths,
        }
      });

      // Update English translation and mock others
      const locales: LocaleCode[] = ['EN', 'ZH_CN', 'JA', 'AR'];
      if (dto.name || dto.description || dto.shortDescription) {
        for (const locale of locales) {
          const prefix = locale === 'EN' ? '' : `[${locale}] `;
          await prisma.productTranslation.upsert({
            where: { productId_locale: { productId: id, locale } },
            update: {
              name: dto.name ? `${prefix}${dto.name}` : undefined,
              shortDescription: dto.shortDescription !== undefined ? `${prefix}${dto.shortDescription}` : undefined,
              description: dto.description !== undefined ? `${prefix}${dto.description}` : undefined,
            },
            create: {
              productId: id,
              locale,
              name: `${prefix}${dto.name || updated.slug}`,
              shortDescription: dto.shortDescription ? `${prefix}${dto.shortDescription}` : undefined,
              description: dto.description ? `${prefix}${dto.description}` : undefined,
            }
          });
        }
      }

      // Update Specs
      if (dto.specs !== undefined) {
        await prisma.productSpec.deleteMany({ where: { productId: id } });
        for (const locale of locales) {
          const prefix = locale === 'EN' ? '' : `[${locale}] `;
          let sortOrder = 0;
          for (const s of dto.specs) {
            await prisma.productSpec.create({
              data: {
                productId: id,
                locale,
                specKey: `${prefix}${s.key}`,
                specValue: `${prefix}${s.value}`,
                sortOrder: sortOrder++
              }
            });
          }
        }
      }

      // Update Custom Options
      if (dto.customizationOptions !== undefined) {
        await prisma.productCustomizationOption.deleteMany({ where: { productId: id } });
        for (const locale of locales) {
          const prefix = locale === 'EN' ? '' : `[${locale}] `;
          let sortOrder = 0;
          for (const o of dto.customizationOptions) {
            await prisma.productCustomizationOption.create({
              data: {
                productId: id,
                locale,
                optionKey: `${prefix}${o.key}`,
                optionValue: `${prefix}${o.value}`,
                sortOrder: sortOrder++
              }
            });
          }
        }
      }

      // Link Media
      if (dto.mediaIds !== undefined) {
        await prisma.productMedia.deleteMany({ where: { productId: id } });
        let sortOrder = 0;
        for (const mediaId of dto.mediaIds) {
          await prisma.productMedia.create({
            data: {
              productId: id,
              mediaFileId: mediaId,
              sortOrder: sortOrder++,
              isPrimary: sortOrder === 1,
            }
          });
        }
      }

      return updated;
    });
  }
}
