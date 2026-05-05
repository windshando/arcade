import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class CrmService {
  constructor(private readonly prisma: PrismaService) {}

  async getLeads() {
    return this.prisma.inquiry.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        product: true,
      },
    });
  }

  async getLeadDetail(id: string) {
    const inquiry = await this.prisma.inquiry.findUnique({
      where: { id },
      include: {
        product: true,
        activities: {
          orderBy: { createdAt: 'desc' },
          include: { adminUser: true }
        },
        notes: {
          orderBy: { createdAt: 'desc' },
          include: { adminUser: true }
        },
        chatSessions: {
          include: {
            messages: true
          }
        }
      },
    });
    if (!inquiry) throw new NotFoundException('Inquiry not found');
    return inquiry;
  }

  async updateLead(id: string, dto: UpdateLeadDto, adminId: string) {
    const updateData: any = {};
    if (dto.status !== undefined) updateData.status = dto.status;
    if (dto.assignedAdminId !== undefined) updateData.assignedToAdminId = dto.assignedAdminId;
    if (dto.tags !== undefined) updateData.tags = dto.tags;

    const inquiry = await this.prisma.inquiry.update({
      where: { id },
      data: updateData,
    });

    if (dto.status || dto.assignedAdminId) {
      await this.prisma.leadActivity.create({
        data: {
          inquiryId: inquiry.id,
          activityType: 'STATUS_CHANGE',
          summary: `Lead updated. Status: ${inquiry.status}`,
          adminUserId: adminId,
        },
      });
    }

    return inquiry;
  }

  async addNote(id: string, notes: string, adminId: string) {
    return this.prisma.leadNote.create({
      data: {
        inquiryId: id,
        body: notes,
        adminUserId: adminId,
      },
    });
  }
}

