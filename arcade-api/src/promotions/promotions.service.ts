import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) {}

  async getPublicPromotion(slug: string) {
    // We increment viewCount natively here every time the landing page is fetched!
    const promotion = await this.prisma.promotion.update({
      where: { slug, status: 'PUBLISHED' },
      data: { viewCount: { increment: 1 } },
      include: { targetProduct: true, targetCategory: true }
    }).catch(() => null); // Catch if not found or not published to return 404 cleanly

    if (!promotion) throw new NotFoundException('Promotion not found or expired.');
    
    return promotion;
  }

  async getAdminPromotions() {
    const promos = await this.prisma.promotion.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // For every promotion, dynamically tally exactly how many leads match!
    const promosWithStats = await Promise.all(promos.map(async (promo: any) => {
       const inquiryCount = await this.prisma.inquiry.count({
          where: { utmCampaign: promo.slug }
       });
       return { ...promo, inquiryCount };
    }));

    return promosWithStats;
  }

  async getAdminPromotionById(id: string) {
    return this.prisma.promotion.findUnique({
      where: { id }
    });
  }

  async saveAdminPromotion(data: any) {
    const slug = data.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (data.id && data.id !== 'new') {
      return this.prisma.promotion.update({
        where: { id: data.id },
        data: {
          slug,
          title: data.title,
          description: data.description,
          bodyHtml: data.bodyHtml,
          status: data.status,
          targetProductId: data.targetProductId || null,
          targetCategoryId: data.targetCategoryId || null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
        }
      });
    } else {
      return this.prisma.promotion.create({
        data: {
          slug,
          title: data.title,
          description: data.description,
          bodyHtml: data.bodyHtml,
          status: data.status,
          targetProductId: data.targetProductId || null,
          targetCategoryId: data.targetCategoryId || null,
          startDate: data.startDate ? new Date(data.startDate) : null,
          endDate: data.endDate ? new Date(data.endDate) : null,
        }
      });
    }
  }
}
