import { Module } from '@nestjs/common';
import { AdvantagesService } from './advantages.service';
import { AdvantagesController } from './advantages.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdvantagesController],
  providers: [AdvantagesService],
})
export class AdvantagesModule {}
