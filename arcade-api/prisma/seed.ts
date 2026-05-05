import { PrismaClient, AdminRole, ContentStatus, LocaleCode, LeadStatus, InquiryType, ContactMethod } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Locales
  console.log('Seeding locales...');
  const locales = [
    { code: 'EN' as LocaleCode, label: 'English', isDefault: true, isEnabled: true },
    { code: 'ZH_CN' as LocaleCode, label: '简体中文', isDefault: false, isEnabled: true },
    { code: 'JA' as LocaleCode, label: '日本語', isDefault: false, isEnabled: false },
    { code: 'AR' as LocaleCode, label: 'العربية', isDefault: false, isEnabled: false }
  ];
  for (const l of locales) {
    await prisma.locale.upsert({
      where: { code: l.code },
      update: l,
      create: l,
    });
  }

  // 2. Admin Users
  console.log('Seeding admin users...');
  const admins = [
    { email: "admin@example.com", password: "ChangeMe123!", role: "SUPER_ADMIN", displayName: "System Admin" },
    { email: "sales@example.com", password: "ChangeMe123!", role: "SALES", displayName: "Sales Manager" },
    { email: "editor@example.com", password: "ChangeMe123!", role: "EDITOR", displayName: "Content Editor" }
  ];
  for (const a of admins) {
    const passwordHash = await bcrypt.hash(a.password, 10);
    await prisma.adminUser.upsert({
      where: { email: a.email },
      update: { role: a.role as AdminRole, displayName: a.displayName, passwordHash },
      create: { email: a.email, role: a.role as AdminRole, displayName: a.displayName, passwordHash },
    });
  }

  // 3. Lead Sources
  console.log('Seeding lead sources...');
  const sources = [
    { key: "direct", label: "Direct" },
    { key: "google-organic", label: "Google Organic" },
    { key: "google-ads", label: "Google Ads" },
    { key: "facebook", label: "Facebook" },
    { key: "whatsapp", label: "WhatsApp" },
    { key: "wechat", label: "WeChat" },
    { key: "trade-show", label: "Trade Show" },
    { key: "manual-import", label: "Manual Import" }
  ];
  for (const s of sources) {
    await prisma.leadSource.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }

  // 4. Product Categories
  console.log('Seeding product categories...');
  const categories = [
    {
      slug: "claw-machines",
      translations: {
        EN: { name: "Claw Machines", description: "Commercial claw machines for malls and game centers." },
        ZH_CN: { name: "抓娃娃机", description: "适用于商场和游戏中心的商用抓娃娃机。" }
      }
    },
    {
      slug: "racing-games",
      translations: {
        EN: { name: "Racing Games", description: "Commercial racing arcade machines." },
        ZH_CN: { name: "赛车游戏机", description: "商用赛车街机设备。" }
      }
    },
    {
      slug: "basketball-machines",
      translations: {
        EN: { name: "Basketball Machines", description: "Arcade basketball machines for entertainment venues." },
        ZH_CN: { name: "篮球机", description: "适用于娱乐场所的街机篮球机。" }
      }
    }
  ];

  for (const c of categories) {
    let category = await prisma.productCategory.findUnique({ where: { slug: c.slug } });
    if (!category) {
      category = await prisma.productCategory.create({ data: { slug: c.slug } });
    }
    for (const [locale, t] of Object.entries(c.translations)) {
      await prisma.productCategoryTranslation.upsert({
        where: { categoryId_locale: { categoryId: category.id, locale: locale as LocaleCode } },
        update: t,
        create: { ...t, categoryId: category.id, locale: locale as LocaleCode },
      });
    }
  }

  // 5. Products
  console.log('Seeding products...');
  const products = [
    {
      slug: "galaxy-claw-pro",
      sku: "ACM-CLAW-001",
      categorySlug: "claw-machines",
      status: "PUBLISHED",
      isFeatured: true,
      voltage: "110V / 220V",
      powerConsumption: "350W",
      dimensions: "900 x 850 x 1950 mm",
      weight: "95 kg",
      playerCount: "1",
      moq: 1,
      leadTimeDays: 15,
      warrantyMonths: 12,
      targetVenue: "Mall / Arcade / Family Entertainment Center",
      customizationEnabled: true,
      translations: {
        EN: {
          name: "Galaxy Claw Pro",
          shortDescription: "A commercial claw machine with LED lighting and customizable cabinet graphics.",
          description: "Galaxy Claw Pro is designed for shopping malls, arcades, and prize corners. It supports cabinet branding, voltage customization, and multiple prize layouts."
        },
        ZH_CN: {
          name: "银河抓娃娃 Pro",
          shortDescription: "带 LED 灯效和机身图案定制能力的商用抓娃娃机。",
          description: "银河抓娃娃 Pro 适用于商场、游戏厅和礼品区，支持机身贴图定制、电压适配和多种礼品摆放布局。"
        }
      },
      specs: [
        { specKey: "cabinet_material", specValue: "Powder-coated steel" },
        { specKey: "payment_support", specValue: "Coin / Bill / Card / QR" },
        { specKey: "lighting", specValue: "RGB LED" }
      ],
      customizationOptions: [
        { optionKey: "cabinet_color", optionValue: "Custom color available" },
        { optionKey: "logo_branding", optionValue: "Custom logo stickers available" },
        { optionKey: "payment_system", optionValue: "Optional local payment modules" }
      ]
    },
    {
      slug: "thunder-racer-x2",
      sku: "ACM-RACE-002",
      categorySlug: "racing-games",
      status: "PUBLISHED",
      isFeatured: true,
      voltage: "220V",
      powerConsumption: "800W",
      dimensions: "1800 x 1500 x 2100 mm",
      weight: "220 kg",
      playerCount: "2",
      moq: 1,
      leadTimeDays: 25,
      warrantyMonths: 12,
      targetVenue: "Arcade / FEC / Cinema",
      customizationEnabled: false,
      translations: {
        EN: {
          name: "Thunder Racer X2",
          shortDescription: "A dual-seat racing arcade machine for high-traffic entertainment centers.",
          description: "Thunder Racer X2 features immersive seats, HD display, and stable commercial operation for frequent use."
        },
        ZH_CN: {
          name: "雷霆赛车 X2",
          shortDescription: "适合高流量娱乐中心的双人赛车街机。",
          description: "雷霆赛车 X2 配备沉浸式座椅、高清显示屏，并适用于高频商用场景。"
        }
      },
      specs: [
        { specKey: "display", specValue: "42-inch HD display" },
        { specKey: "audio", specValue: "Stereo speakers" },
        { specKey: "control", specValue: "Force-feedback steering" }
      ],
      customizationOptions: []
    }
  ];

  for (const p of products) {
    const category = await prisma.productCategory.findUnique({ where: { slug: p.categorySlug } });
    if (!category) continue;

    let product = await prisma.product.findUnique({ where: { slug: p.slug } });
    const productData = {
      categoryId: category.id,
      sku: p.sku,
      status: p.status as ContentStatus,
      isFeatured: p.isFeatured,
      voltage: p.voltage,
      powerConsumption: p.powerConsumption,
      dimensions: p.dimensions,
      weight: p.weight,
      playerCount: p.playerCount,
      moq: p.moq,
      leadTimeDays: p.leadTimeDays,
      warrantyMonths: p.warrantyMonths,
      targetVenue: p.targetVenue,
      customizationEnabled: p.customizationEnabled,
    };

    if (!product) {
      product = await prisma.product.create({ data: { slug: p.slug, ...productData } });
    } else {
      product = await prisma.product.update({ where: { id: product.id }, data: productData });
    }

    for (const [locale, t] of Object.entries(p.translations)) {
      await prisma.productTranslation.upsert({
        where: { productId_locale: { productId: product.id, locale: locale as LocaleCode } },
        update: t,
        create: { ...t, productId: product.id, locale: locale as LocaleCode },
      });
    }
    
    // clear and re-create specs
    await prisma.productSpec.deleteMany({ where: { productId: product.id } });
    if (p.specs.length > 0) {
      await prisma.productSpec.createMany({
        data: p.specs.map(s => ({ ...s, productId: product.id }))
      });
    }

    // clear and re-create customization Options
    await prisma.productCustomizationOption.deleteMany({ where: { productId: product.id } });
    if (p.customizationOptions.length > 0) {
      await prisma.productCustomizationOption.createMany({
        data: p.customizationOptions.map(co => ({ ...co, productId: product.id }))
      });
    }
  }

  // 6. Blog Categories and Posts
  console.log('Seeding blogs...');
  const blogCategories = [
    { slug: "industry-news", translations: { EN: { name: "Industry News" }, ZH_CN: { name: "行业资讯" } } },
    { slug: "buying-guides", translations: { EN: { name: "Buying Guides" }, ZH_CN: { name: "采购指南" } } }
  ];

  for (const c of blogCategories) {
    let cat = await prisma.blogCategory.findUnique({ where: { slug: c.slug } });
    if (!cat) cat = await prisma.blogCategory.create({ data: { slug: c.slug } });
    for (const [locale, t] of Object.entries(c.translations)) {
      await prisma.blogCategoryTranslation.upsert({
        where: { blogCategoryId_locale: { blogCategoryId: cat.id, locale: locale as LocaleCode } },
        update: t,
        create: { ...t, blogCategoryId: cat.id, locale: locale as LocaleCode },
      });
    }
  }

  const posts = [
    {
      slug: "how-to-choose-a-claw-machine-for-a-mall",
      status: "PUBLISHED",
      categorySlug: "buying-guides",
      translations: {
        EN: {
          title: "How to Choose a Claw Machine for a Mall",
          excerpt: "A practical guide for buyers choosing claw machines for shopping mall deployment.",
          content: "<p>Start with foot traffic, payout settings, serviceability, and cabinet durability...</p>"
        },
        ZH_CN: {
          title: "商场如何选择抓娃娃机",
          excerpt: "面向采购方的商场抓娃娃机选型实用指南。",
          content: "<p>首先应评估客流量、出奖设置、维护便利性和机柜耐用性……</p>"
        }
      }
    }
  ];

  for (const p of posts) {
    const cat = await prisma.blogCategory.findUnique({ where: { slug: p.categorySlug } });
    if (!cat) continue;

    let post = await prisma.blogPost.findUnique({ where: { slug: p.slug } });
    if (!post) {
      post = await prisma.blogPost.create({ data: { slug: p.slug, status: p.status as ContentStatus, categoryId: cat.id } });
    } else {
      post = await prisma.blogPost.update({ where: { id: post.id }, data: { status: p.status as ContentStatus, categoryId: cat.id } });
    }

    for (const [locale, t] of Object.entries(p.translations)) {
      await prisma.blogPostTranslation.upsert({
        where: { postId_locale: { postId: post.id, locale: locale as LocaleCode } },
        update: t,
        create: { ...t, postId: post.id, locale: locale as LocaleCode },
      });
    }
  }

  // 7. Static Pages
  console.log('Seeding static pages...');
  const pages = [
    {
      pageKey: "about", status: "PUBLISHED",
      translations: {
        EN: { title: "About Us", content: "<p>We supply commercial arcade game machines for global buyers.</p>" },
        ZH_CN: { title: "关于我们", content: "<p>我们为全球客户提供商用街机设备。</p>" }
      }
    },
    {
      pageKey: "warranty", status: "PUBLISHED",
      translations: {
        EN: { title: "Warranty Policy", content: "<p>Standard warranty terms and replacement process.</p>" },
        ZH_CN: { title: "保修政策", content: "<p>标准保修条款与更换流程。</p>" }
      }
    },
    {
      pageKey: "privacy", status: "PUBLISHED",
      translations: {
        EN: { title: "Privacy Policy", content: "<p>This page describes data collection, tracking, and storage practices.</p>" },
        ZH_CN: { title: "隐私政策", content: "<p>本页面说明数据收集、追踪与存储方式。</p>" }
      }
    }
  ];

  for (const p of pages) {
    let page = await prisma.staticPage.findUnique({ where: { pageKey: p.pageKey } });
    if (!page) {
      page = await prisma.staticPage.create({ data: { pageKey: p.pageKey, status: p.status as ContentStatus } });
    } else {
      page = await prisma.staticPage.update({ where: { id: page.id }, data: { status: p.status as ContentStatus } });
    }

    for (const [locale, t] of Object.entries(p.translations)) {
      await prisma.staticPageTranslation.upsert({
        where: { pageId_locale: { pageId: page.id, locale: locale as LocaleCode } },
        update: t,
        create: { ...t, pageId: page.id, locale: locale as LocaleCode },
      });
    }
  }

  // 7.5 Customers and Inquiries (Leads)
  console.log('Seeding customers and inquiries...');
  
  const leadStatuses = Object.values(LeadStatus);
  for (let i = 0; i < leadStatuses.length; i++) {
    const status = leadStatuses[i];
    
    // Create a customer for each status
    let customer = await prisma.customer.findFirst({
      where: { companyName: `Test Company ${status}` }
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          companyName: `Test Company ${status}`,
          website: `https://${status.toLowerCase()}.example.com`,
          countryCode: 'US',
          preferredLocale: 'EN',
          preferredContactMethod: 'EMAIL',
          notes: `Auto-generated customer for status: ${status}`,
          contacts: {
            create: {
              firstName: 'Test',
              lastName: 'User',
              email: `test_${status.toLowerCase()}@example.com`,
              phone: `+1-555-010${i}`,
              isPrimary: true
            }
          }
        }
      });
    }

    // Create an inquiry for this customer matching the status
    const inquirySubject = `Interested in Arcade Machines - ${status} phase`;
    let inquiry = await prisma.inquiry.findFirst({
      where: { subject: inquirySubject, customerId: customer.id }
    });

    if (!inquiry) {
      // Pick a random product for realism, assume at least 1 exists
      const product = await prisma.product.findFirst();

      await prisma.inquiry.create({
        data: {
          inquiryType: 'PRODUCT',
          status: status,
          customerId: customer.id,
          productId: product?.id,
          subject: inquirySubject,
          message: `Hello, we would like to evaluate your products. We are currently testing the pipeline for the ${status} status.`,
          requestedQuantity: 5 + i * 2,
          contactName: `Test User`,
          contactEmail: `test_${status.toLowerCase()}@example.com`,
          companyName: customer.companyName,
          countryCode: customer.countryCode,
          locale: customer.preferredLocale,
          preferredContactMethod: customer.preferredContactMethod
        }
      });
    }
  }

  // 8. Site Settings
  console.log('Seeding site settings...');
  const settings = [
    { settingKey: "site.brand", settingValue: { companyName: "Arcade Machine Trade", defaultLocale: "EN" } },
    { settingKey: "site.contact", settingValue: { email: "sales@example.com", phone: "+1 555 000 0000", whatsapp: "+1 555 111 1111", wechat: "arcade-sales" } },
    { settingKey: "site.seo.defaults", settingValue: { title: "Commercial Arcade Game Machines", description: "B2B arcade machine supplier website." } }
  ];

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { settingKey: s.settingKey },
      update: { settingValue: s.settingValue },
      create: { settingKey: s.settingKey, settingValue: s.settingValue },
    });
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
