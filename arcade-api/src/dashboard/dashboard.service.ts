import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardStats() {
    const totalProducts = await this.prisma.product.count();
    const totalLeads = await this.prisma.inquiry.count();
    const totalPosts = await this.prisma.blogPost.count();

    const leadsByStatus = await this.prisma.inquiry.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    });

    const recentInquiries = await this.prisma.inquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        contactName: true,
        companyName: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      metrics: {
        totalProducts,
        totalLeads,
        totalPosts,
      },
      leadsByStatus,
      recentInquiries,
    };
  }
}
