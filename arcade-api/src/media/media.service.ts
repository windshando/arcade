import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async saveMediaRecord(file: Express.Multer.File, adminUserId: string) {
    return this.prisma.mediaFile.create({
      data: {
        storageKey: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        fileSize: file.size,
        uploadedById: adminUserId,
      }
    });
  }

  async getMediaRecord(storageKey: string) {
    return this.prisma.mediaFile.findUnique({
      where: { storageKey }
    });
  }
}
