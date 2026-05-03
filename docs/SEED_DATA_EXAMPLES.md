# SEED_DATA_EXAMPLES.md

## Purpose

This file provides realistic initial data examples for:
- locales
- admin users
- lead sources
- product categories
- products
- blog categories
- static pages
- site settings

The goal is to let an AI developer generate a working local demo quickly.

---

## 1. Locales

```json
[
  { "code": "EN", "label": "English", "isDefault": true, "isEnabled": true },
  { "code": "ZH_CN", "label": "简体中文", "isDefault": false, "isEnabled": true },
  { "code": "JA", "label": "日本語", "isDefault": false, "isEnabled": false },
  { "code": "AR", "label": "العربية", "isDefault": false, "isEnabled": false }
]
```

## 2. Admin users

```json
[
  {
    "email": "admin@example.com",
    "password": "ChangeMe123!",
    "role": "SUPER_ADMIN",
    "displayName": "System Admin"
  },
  {
    "email": "sales@example.com",
    "password": "ChangeMe123!",
    "role": "SALES",
    "displayName": "Sales Manager"
  },
  {
    "email": "editor@example.com",
    "password": "ChangeMe123!",
    "role": "EDITOR",
    "displayName": "Content Editor"
  }
]
```

## 3. Lead sources

```json
[
  { "key": "direct", "label": "Direct" },
  { "key": "google-organic", "label": "Google Organic" },
  { "key": "google-ads", "label": "Google Ads" },
  { "key": "facebook", "label": "Facebook" },
  { "key": "whatsapp", "label": "WhatsApp" },
  { "key": "wechat", "label": "WeChat" },
  { "key": "trade-show", "label": "Trade Show" },
  { "key": "manual-import", "label": "Manual Import" }
]
```

## 4. Product categories with translations

```json
[
  {
    "slug": "claw-machines",
    "translations": {
      "EN": { "name": "Claw Machines", "description": "Commercial claw machines for malls and game centers." },
      "ZH_CN": { "name": "抓娃娃机", "description": "适用于商场和游戏中心的商用抓娃娃机。" }
    }
  },
  {
    "slug": "racing-games",
    "translations": {
      "EN": { "name": "Racing Games", "description": "Commercial racing arcade machines." },
      "ZH_CN": { "name": "赛车游戏机", "description": "商用赛车街机设备。" }
    }
  },
  {
    "slug": "basketball-machines",
    "translations": {
      "EN": { "name": "Basketball Machines", "description": "Arcade basketball machines for entertainment venues." },
      "ZH_CN": { "name": "篮球机", "description": "适用于娱乐场所的街机篮球机。" }
    }
  }
]
```

## 5. Products with translations, specs, and customization

```json
[
  {
    "slug": "galaxy-claw-pro",
    "sku": "ACM-CLAW-001",
    "categorySlug": "claw-machines",
    "status": "PUBLISHED",
    "isFeatured": true,
    "voltage": "110V / 220V",
    "powerConsumption": "350W",
    "dimensions": "900 x 850 x 1950 mm",
    "weight": "95 kg",
    "playerCount": 1,
    "moq": 1,
    "leadTimeDays": 15,
    "warrantyMonths": 12,
    "targetVenue": "Mall / Arcade / Family Entertainment Center",
    "customizationEnabled": true,
    "translations": {
      "EN": {
        "name": "Galaxy Claw Pro",
        "shortDescription": "A commercial claw machine with LED lighting and customizable cabinet graphics.",
        "description": "Galaxy Claw Pro is designed for shopping malls, arcades, and prize corners. It supports cabinet branding, voltage customization, and multiple prize layouts."
      },
      "ZH_CN": {
        "name": "银河抓娃娃 Pro",
        "shortDescription": "带 LED 灯效和机身图案定制能力的商用抓娃娃机。",
        "description": "银河抓娃娃 Pro 适用于商场、游戏厅和礼品区，支持机身贴图定制、电压适配和多种礼品摆放布局。"
      }
    },
    "specs": [
      { "specKey": "cabinet_material", "specValue": "Powder-coated steel" },
      { "specKey": "payment_support", "specValue": "Coin / Bill / Card / QR" },
      { "specKey": "lighting", "specValue": "RGB LED" }
    ],
    "customizationOptions": [
      { "optionKey": "cabinet_color", "optionValue": "Custom color available" },
      { "optionKey": "logo_branding", "optionValue": "Custom logo stickers available" },
      { "optionKey": "payment_system", "optionValue": "Optional local payment modules" }
    ]
  },
  {
    "slug": "thunder-racer-x2",
    "sku": "ACM-RACE-002",
    "categorySlug": "racing-games",
    "status": "PUBLISHED",
    "isFeatured": true,
    "voltage": "220V",
    "powerConsumption": "800W",
    "dimensions": "1800 x 1500 x 2100 mm",
    "weight": "220 kg",
    "playerCount": 2,
    "moq": 1,
    "leadTimeDays": 25,
    "warrantyMonths": 12,
    "targetVenue": "Arcade / FEC / Cinema",
    "customizationEnabled": false,
    "translations": {
      "EN": {
        "name": "Thunder Racer X2",
        "shortDescription": "A dual-seat racing arcade machine for high-traffic entertainment centers.",
        "description": "Thunder Racer X2 features immersive seats, HD display, and stable commercial operation for frequent use."
      },
      "ZH_CN": {
        "name": "雷霆赛车 X2",
        "shortDescription": "适合高流量娱乐中心的双人赛车街机。",
        "description": "雷霆赛车 X2 配备沉浸式座椅、高清显示屏，并适用于高频商用场景。"
      }
    },
    "specs": [
      { "specKey": "display", "specValue": "42-inch HD display" },
      { "specKey": "audio", "specValue": "Stereo speakers" },
      { "specKey": "control", "specValue": "Force-feedback steering" }
    ],
    "customizationOptions": []
  }
]
```

## 6. Blog categories and posts

```json
{
  "blogCategories": [
    {
      "slug": "industry-news",
      "translations": {
        "EN": { "name": "Industry News" },
        "ZH_CN": { "name": "行业资讯" }
      }
    },
    {
      "slug": "buying-guides",
      "translations": {
        "EN": { "name": "Buying Guides" },
        "ZH_CN": { "name": "采购指南" }
      }
    }
  ],
  "posts": [
    {
      "slug": "how-to-choose-a-claw-machine-for-a-mall",
      "status": "PUBLISHED",
      "categorySlug": "buying-guides",
      "translations": {
        "EN": {
          "title": "How to Choose a Claw Machine for a Mall",
          "excerpt": "A practical guide for buyers choosing claw machines for shopping mall deployment.",
          "content": "<p>Start with foot traffic, payout settings, serviceability, and cabinet durability...</p>"
        },
        "ZH_CN": {
          "title": "商场如何选择抓娃娃机",
          "excerpt": "面向采购方的商场抓娃娃机选型实用指南。",
          "content": "<p>首先应评估客流量、出奖设置、维护便利性和机柜耐用性……</p>"
        }
      }
    }
  ]
}
```

## 7. Static pages

```json
[
  {
    "pageKey": "about",
    "status": "PUBLISHED",
    "translations": {
      "EN": {
        "title": "About Us",
        "content": "<p>We supply commercial arcade game machines for global buyers.</p>"
      },
      "ZH_CN": {
        "title": "关于我们",
        "content": "<p>我们为全球客户提供商用街机设备。</p>"
      }
    }
  },
  {
    "pageKey": "warranty",
    "status": "PUBLISHED",
    "translations": {
      "EN": {
        "title": "Warranty Policy",
        "content": "<p>Standard warranty terms and replacement process.</p>"
      },
      "ZH_CN": {
        "title": "保修政策",
        "content": "<p>标准保修条款与更换流程。</p>"
      }
    }
  },
  {
    "pageKey": "privacy",
    "status": "PUBLISHED",
    "translations": {
      "EN": {
        "title": "Privacy Policy",
        "content": "<p>This page describes data collection, tracking, and storage practices.</p>"
      },
      "ZH_CN": {
        "title": "隐私政策",
        "content": "<p>本页面说明数据收集、追踪与存储方式。</p>"
      }
    }
  }
]
```

## 8. Site settings

```json
[
  {
    "settingKey": "site.brand",
    "settingValue": {
      "companyName": "Arcade Machine Trade",
      "defaultLocale": "EN"
    }
  },
  {
    "settingKey": "site.contact",
    "settingValue": {
      "email": "sales@example.com",
      "phone": "+1 555 000 0000",
      "whatsapp": "+1 555 111 1111",
      "wechat": "arcade-sales"
    }
  },
  {
    "settingKey": "site.seo.defaults",
    "settingValue": {
      "title": "Commercial Arcade Game Machines",
      "description": "B2B arcade machine supplier website."
    }
  }
]
```

## Seed implementation notes

- Use upsert by unique key or slug.
- Seed locales before translated content.
- Seed categories before products.
- Seed blog categories before blog posts.
- Seed static pages after locales.
- Hash admin passwords during seed execution, not in raw seed files.
