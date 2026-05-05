import { Module } from '@nestjs/common';
import { RecruitmentService } from './recruitment.service';
import { RecruitmentController } from './recruitment.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SiteSettingsModule } from '../site-settings/site-settings.module';

@Module({
  imports: [PrismaModule, SiteSettingsModule],
  controllers: [RecruitmentController],
  providers: [RecruitmentService]
})
export class RecruitmentModule {}
