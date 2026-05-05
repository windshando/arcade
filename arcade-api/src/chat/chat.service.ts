import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async startSession(ipAddress: string, deviceInfo: string) {
    let session = await this.prisma.chatSession.findFirst({
      where: { deviceInfo, status: 'ACTIVE' },
      include: { messages: { orderBy: { createdAt: 'asc' } } }
    });

    if (!session) {
      session = await this.prisma.chatSession.create({
        data: {
          ipAddress,
          deviceInfo,
        },
        include: { messages: true }
      }) as any;
    }
    return session;
  }

  async setSessionDetails(sessionId: string, email: string, visitorName?: string) {
    let session = await this.prisma.chatSession.findUnique({ where: { id: sessionId }, include: { inquiry: true } });
    if (!session) throw new Error('Session not found');

    let inquiry = session.inquiry;
    if (!inquiry) {
      inquiry = await this.prisma.inquiry.create({
        data: {
          inquiryType: 'SUPPORT',
          contactEmail: email,
          contactName: visitorName,
          status: 'NEW',
          ipAddress: session.ipAddress,
          userAgent: session.deviceInfo,
        }
      });
      await this.prisma.leadActivity.create({
        data: {
          inquiryId: inquiry.id,
          activityType: 'CHAT_STARTED',
          summary: 'User started a chat session',
        }
      });
    } else {
      await this.prisma.inquiry.update({
        where: { id: inquiry.id },
        data: { contactEmail: email, ...(visitorName ? { contactName: visitorName } : {}) }
      });
    }

    await this.prisma.chatSession.update({
      where: { id: sessionId },
      data: { email, visitorName, inquiryId: inquiry.id }
    });

    return this.prisma.chatSession.findUnique({ where: { id: sessionId }, include: { messages: true }});
  }

  async saveMessage(sessionId: string, senderType: 'VISITOR' | 'ADMIN', content: string, senderId?: string, senderName?: string) {
    const msg = await this.prisma.chatMessage.create({
      data: {
        sessionId,
        senderType,
        senderId,
        senderName,
        content,
      }
    });
    return msg;
  }

  async getMessages(sessionId: string) {
    return this.prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async getActiveSessions() {
    return this.prisma.chatSession.findMany({
      where: { email: { not: null } },
      orderBy: { updatedAt: 'desc' },
      take: 50,
      include: {
        inquiry: true,
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });
  }
}
