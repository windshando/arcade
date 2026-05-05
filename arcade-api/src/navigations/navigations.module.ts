import { Module } from '@nestjs/common';
import { NavigationsService } from './navigations.service';
import { NavigationsController } from './navigations.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [NavigationsController],
  providers: [NavigationsService],
})
export class NavigationsModule {}
