# IMPLEMENTATION_BOOTSTRAP.md

## Objective

This file tells an AI developer exactly how to start the project with minimal ambiguity.

## Step 1. Create monorepo

Recommended structure:

```text
arcade-trade-platform/
  apps/
    web/
    api/
  packages/
    types/
    eslint-config/
    tsconfig/
  prisma/
  docs/
```

Tooling recommendation:
- pnpm workspace
- Turborepo optional, not required for v1

## Step 2. Backend bootstrap

- Create NestJS app in `apps/api`
- Install Prisma in repo root or backend app scope
- Connect PostgreSQL
- Add auth module first
- Add products, inquiries, blog, static pages, settings modules

## Step 3. Frontend bootstrap

- Create Next.js app in `apps/web`
- Use App Router
- Add Tailwind CSS
- Add next-intl for i18n
- Add public locale routes
- Build layout, homepage, product pages, blog pages, static pages, contact/quote forms

## Step 4. Shared types

Create a shared package or generated types for:
- product summary
- product detail
- inquiry form payload
- blog summary
- static page payload
- locale config

## Step 5. Environment files

### Backend `.env`

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/arcade_trade
JWT_ACCESS_SECRET=change_me_access
JWT_REFRESH_SECRET=change_me_refresh
CORS_ORIGIN=http://localhost:3000
STORAGE_DRIVER=local
UPLOAD_DIR=./uploads
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api/v1
```

## Step 6. First API milestones

Build in this order:
1. auth
2. locales
3. categories
4. products
5. inquiries
6. static pages
7. blog
8. site settings
9. CRM extensions

## Step 7. First frontend milestones

Build in this order:
1. locale routing and base layout
2. homepage skeleton
3. product category page
4. product detail page
5. contact / quote form
6. static pages
7. blog pages
8. admin login
9. admin dashboard shell

## Step 8. Definition of done for MVP

The MVP is considered complete when:
- public site supports at least English and Simplified Chinese
- admin can log in
- admin can manage product categories and products
- admin can manage blog posts
- admin can manage static pages
- contact and quote forms create inquiries in CRM
- inquiry records preserve source tracking data
- SEO metadata exists for products, blog posts, and static pages
