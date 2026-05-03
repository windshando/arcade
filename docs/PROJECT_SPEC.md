# PROJECT_SPEC.md

## Project Overview

This project is a **B2B arcade game machine trade website** designed for lead generation, customer relationship management, structured product presentation, and content publishing.

It is not a pure ecommerce site in V1. The primary goal is to:

- attract qualified global buyers
- present arcade machine products professionally
- support product inquiry and customization requests
- centralize customer and lead tracking in a CRM-like admin system
- publish blog/news content for SEO and trust building
- support internationalization (i18n) from the beginning

## Business Positioning

The website serves as a **trade-oriented digital showroom + lead management platform**.

Typical customer actions:

- browse product categories
- review product details and specifications
- request quotations
- ask about customization
- contact sales by multiple methods
- read company, warranty, and blog content
- submit inquiry details that become leads in the CRM

## Primary Roles

### Public Users
- browse categories and products
- submit inquiries
- request customization
- read blog/news
- read static pages such as about, warranty, privacy, and contact

### Admin Users
- manage products and categories
- manage blog/news posts
- manage static pages
- manage inquiries and CRM records
- track sources and lead activity
- configure site settings and i18n content where needed

## Core Modules

1. CRM + inquiry + lead tracking
2. Product catalog and customization support
3. Simple CMS for blog/news
4. Static content pages
5. Admin management system
6. i18n infrastructure

## Core Functional Scope

### 1. CRM + Inquiry + Lead Tracking
- general contact submission
- product inquiry submission
- customization inquiry submission
- quote request submission
- lead source tracking
- customer/contact profile management
- lead status management
- follow-up notes and activity logs
- multiple contact methods support

### 2. Product System
- category tree
- product list pages
- product detail pages
- specifications
- gallery/media
- downloadable brochures
- related products
- customization options
- inquiry CTA on every product

### 3. CMS / Blog
- article categories
- article list page
- article detail page
- SEO metadata
- publish/unpublish workflow
- simple rich text content support

### 4. Static Content Pages
- about
- contact
- warranty
- privacy policy
- terms
- shipping/support/FAQ as optional extensions

### 5. Admin System
- admin authentication
- role-based access control
- CRUD for products/categories/posts/pages
- inquiry management
- lead/customer management
- media upload and management
- SEO fields management
- audit logs

### 6. i18n
- multilingual routing
- translation dictionaries
- translatable UI text
- translatable page content fields
- translatable product fields
- locale-aware SEO metadata
- fallback locale strategy

## Suggested Technology Stack

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- i18n library suitable for Next.js
- form validation layer

### Backend
- NestJS
- Prisma ORM
- PostgreSQL
- object storage for media
- email service for notifications

## Deployment Shape

### Recommended V1
- Next.js frontend app
- NestJS backend API
- PostgreSQL database
- admin UI either inside frontend app or as protected admin routes
- media stored in S3-compatible storage or local object storage during early development

## Success Criteria for V1

The project is successful when:

- admin can create and manage categories/products/posts/pages
- public users can browse content in multiple languages
- public users can submit inquiries from multiple entry points
- all inquiries become structured CRM leads
- admin can track and update lead status
- products clearly support specs, media, and customization info
- blog/news content is publishable and SEO-ready
- the entire site supports i18n with a defined fallback strategy

## Non-Goals for V1

- full online checkout
- multi-vendor marketplace
- advanced ERP integration
- advanced quotation PDF engine
- customer portal
- complex 3D product configurator
- full automation of sales workflow

## Future Extensions

- quotation generation and PDF export
- distributor portal
- sample request workflow
- WhatsApp deep integration
- CRM reminders and assignments
- analytics dashboard
- advanced search/filtering
- region-specific catalogs and pricing
- multi-brand management
