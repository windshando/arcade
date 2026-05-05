import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LocaleCode } from '@prisma/client';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  async getPublicFaqs(locale: LocaleCode) {
    const categories = await this.prisma.faqCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      include: {
        translations: { where: { locale } },
        faqs: {
          where: { status: 'PUBLISHED' },
          // Auto Ranking Logic: We calculate order via helpfulness and views.
          // Prisma doesn't natively support dynamic computed order by without raw query,
          // so we'll order by upvotes and sortOrder natively, then sort in memory.
          include: {
            translations: { where: { locale } }
          }
        }
      }
    });

    // Map and calculate helpfulness score
    const result = categories.map(cat => {
      const translation = cat.translations[0];
      const faqs = cat.faqs.map(faq => {
        const ft = faq.translations[0];
        const helpfulnessScore = faq.upvotes - faq.downvotes;
        return {
          id: faq.id,
          question: ft?.question || 'Untitled Question',
          answer: ft?.answer || '',
          upvotes: faq.upvotes,
          downvotes: faq.downvotes,
          viewCount: faq.viewCount,
          helpfulnessScore,
          sortOrder: faq.sortOrder,
        };
      });

      // Auto Rank: Primarily by helpfulness score (DESC), then viewCount (DESC), then native sortOrder (ASC)
      faqs.sort((a, b) => {
        if (b.helpfulnessScore !== a.helpfulnessScore) {
          return b.helpfulnessScore - a.helpfulnessScore;
        }
        if (b.viewCount !== a.viewCount) {
          return b.viewCount - a.viewCount;
        }
        return a.sortOrder - b.sortOrder;
      });

      return {
        id: cat.id,
        slug: cat.slug,
        name: translation?.name || cat.slug,
        faqs,
      };
    }).filter(c => c.faqs.length > 0); // Only return categories that actually have published FAQs in this locale

    return result;
  }

  async voteFaq(id: string, voteType: 'UP' | 'DOWN') {
    const faq = await this.prisma.faq.findUnique({ where: { id } });
    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    if (voteType === 'UP') {
      return this.prisma.faq.update({
        where: { id },
        data: { upvotes: { increment: 1 } }
      });
    } else {
      return this.prisma.faq.update({
        where: { id },
        data: { downvotes: { increment: 1 } }
      });
    }
  }

  // Admin Services
  async getAdminFaqs() {
    return this.prisma.faqCategory.findMany({
      include: {
        translations: true,
        faqs: {
          include: { translations: true }
        }
      }
    });
  }

  async createCategory(slug: string, name: string) {
    return this.prisma.faqCategory.create({
      data: {
        slug,
        translations: {
          create: {
            locale: 'EN',
            name
          }
        }
      }
    });
  }

  async createFaq(categoryId: string, question: string, answer: string) {
    return this.prisma.faq.create({
      data: {
        categoryId,
        status: 'DRAFT', // Change default to DRAFT per user request
        translations: {
          create: {
            locale: 'EN',
            question,
            answer
          }
        }
      }
    });
  }

  async getAdminCategoryById(id: string) {
    return this.prisma.faqCategory.findUnique({
      where: { id },
      include: { translations: true }
    });
  }

  async updateCategory(id: string, slug: string, name: string, isActive: boolean) {
    return this.prisma.faqCategory.update({
      where: { id },
      data: {
        slug,
        isActive,
        translations: {
          upsert: {
            where: { faqCategoryId_locale: { faqCategoryId: id, locale: 'EN' } },
            update: { name },
            create: { locale: 'EN', name }
          }
        }
      }
    });
  }

  async getAdminFaqById(id: string) {
    return this.prisma.faq.findUnique({
      where: { id },
      include: { translations: true }
    });
  }

  async updateFaq(id: string, categoryId: string, status: any, question: string, answer: string) {
    return this.prisma.faq.update({
      where: { id },
      data: {
        categoryId,
        status,
        translations: {
          upsert: {
            where: { faqId_locale: { faqId: id, locale: 'EN' } },
            update: { question, answer },
            create: { locale: 'EN', question, answer }
          }
        }
      }
    });
  }
}
