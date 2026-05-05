import { Module } from '@nestjs/common';
import { SlidesService } from './slides.service';
import { SlidesController } from './slides.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SlidesService],
  controllers: [SlidesController],
  exports: [SlidesService],
})
export class SlidesModule {}
