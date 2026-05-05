import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocalesService {
  constructor(private readonly prisma: PrismaService) {}

  async getEnabledLocales() {
    return this.prisma.locale.findMany({
      where: { isEnabled: true },
      orderBy: { code: 'asc' },
    });
  }

  async getAllLocales() {
    return this.prisma.locale.findMany({
      orderBy: { code: 'asc' },
    });
  }
}
