# TASK_LISTS.md

## 1. Project Setup
- define final sitemap
- define supported locales for V1
- define product taxonomy and category structure
- define lead pipeline statuses
- define mandatory SEO fields
- define admin roles and permissions
- initialize frontend repository
- initialize backend repository
- initialize database and migration workflow
- prepare environment variable strategy
- define deployment environments: local, staging, production

## 2. UI/UX and Content Preparation
- prepare wireframes for homepage
- prepare wireframes for category list page
- prepare wireframes for product detail page
- prepare wireframes for inquiry forms
- prepare wireframes for blog list/detail pages
- prepare wireframes for admin dashboard
- prepare content outlines for about/contact/warranty/privacy pages
- prepare product data import template
- prepare translation key structure
- prepare initial locale content

## 3. Frontend Foundation
- create Next.js project structure
- configure TypeScript and linting
- configure Tailwind CSS
- configure i18n routing and locale switch handling
- define shared layout system
- define SEO metadata utilities
- define API client layer
- define shared form components
- define error/loading/empty-state UI patterns

## 4. Backend Foundation
- create NestJS project structure
- configure modules and folder conventions
- configure Prisma
- connect PostgreSQL
- define migration workflow
- configure validation pipes
- configure exception filters
- configure authentication module
- configure RBAC module
- configure audit logging base structure

## 5. Database and Data Modeling
- design tables for admins/roles/permissions
- design tables for customers/contacts/leads
- design tables for lead activities and notes
- design tables for categories/products/product media/specs
- design tables for product customization options
- design tables for blog posts/categories
- design tables for static pages and translations
- design tables for media assets
- design tables for i18n content strategy
- create migrations
- seed initial reference data

## 6. CRM and Inquiry Module
- define inquiry entry types
- build inquiry API endpoints
- create public inquiry forms
- map inquiries to CRM leads
- create lead list admin UI
- create lead detail UI
- create lead status update flow
- create follow-up notes and activity logs
- create source tracking fields
- support multiple contact methods
- support locale capture per lead

## 7. Product Module
- create category CRUD
- create product CRUD
- create product translation support
- create product list API
- create product detail API
- create specification model and UI
- create media gallery model and UI
- create customization option model and UI
- create related product links
- create product inquiry CTA integration

## 8. CMS Module
- create blog category CRUD
- create post CRUD
- create post translation support
- create editor flow for posts
- create publish/unpublish logic
- create SEO fields for posts
- create public blog list page
- create public blog detail page

## 9. Static Pages Module
- create page CRUD
- create translatable page content
- create public rendering for about/contact/warranty/privacy
- support locale-specific SEO metadata
- support draft/published page states

## 10. Media Module
- create upload API
- create file validation logic
- create media library UI
- support image metadata
- support alt text per locale where needed
- support attachment linking to products/posts/pages

## 11. Public Website Pages
- homepage
- category listing pages
- product listing pages
- product detail pages
- customization page
- blog list page
- blog detail page
- about page
- contact page
- warranty page
- privacy page
- search or filtered browse if included in V1

## 12. Admin Panel
- admin login/logout
- dashboard overview
- product management
- category management
- blog management
- static page management
- CRM lead management
- customer/contact management
- media management
- settings management
- permission checks by role

## 13. i18n
- configure locale-aware routes
- build translation dictionaries for UI strings
- implement locale fallback rules
- implement translated database content strategy
- implement locale-aware URL generation
- implement locale-aware metadata
- implement locale persistence strategy
- test all pages under each locale

## 14. SEO and Tracking
- create metadata generation utilities
- create sitemap generation
- create robots configuration
- create canonical URL logic
- create structured data where useful
- track lead source, UTM, referrer, landing page
- track inquiry submission events
- track CTA clicks where needed

## 15. QA and Testing
- validate forms and required fields
- validate locale switching
- validate SEO metadata output
- validate admin auth and permission rules
- validate image upload limits
- validate inquiry-to-lead conversion logic
- validate published/draft rendering rules
- validate API error handling
- validate responsive UI

## 16. Deployment
- provision PostgreSQL
- provision API host
- provision frontend host
- configure environment variables
- configure file storage
- configure domain and HTTPS
- run migrations in staging
- run migrations in production
- smoke test all critical flows
- create backup policy

## 17. Post-Launch
- review inquiry quality
- review source tracking quality
- review SEO landing page performance
- review lead workflow usability
- fix content gaps
- add higher-performing category pages
- add additional locales if needed
