import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { LocalesModule } from './locales/locales.module';
import { SiteSettingsModule } from './site-settings/site-settings.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { BlogModule } from './blog/blog.module';
import { StaticPagesModule } from './static-pages/static-pages.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { CrmModule } from './crm/crm.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { ChatModule } from './chat/chat.module';
import { MediaModule } from './media/media.module';
import { FaqModule } from './faq/faq.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NewsletterModule } from './newsletter/newsletter.module';
import { PromotionsModule } from './promotions/promotions.module';
import { ExportModule } from './export/export.module';
import { RecruitmentModule } from './recruitment/recruitment.module';
import { SlidesModule } from './slides/slides.module';
import { AdvantagesModule } from './advantages/advantages.module';

import { NavigationsModule } from './navigations/navigations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    LocalesModule,
    SiteSettingsModule,
    CategoriesModule,
    ProductsModule,
    BlogModule,
    StaticPagesModule,
    InquiriesModule,
    CrmModule,
    DashboardModule,
    WebhooksModule,
    ChatModule,
    MediaModule,
    FaqModule,
    NewsletterModule,
    PromotionsModule,
    ExportModule,
    RecruitmentModule,
    SlidesModule,
    AdvantagesModule,
    NavigationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
