# FRONTEND_SPEC.md

## Purpose
The frontend is the public-facing website and may also include protected admin-facing pages depending on deployment strategy.

Its goals are:
- present products clearly
- drive qualified inquiries
- support multilingual content
- provide SEO-friendly rendering
- consume backend APIs consistently

## Frontend Stack
- Next.js
- TypeScript
- Tailwind CSS
- i18n solution for locale-aware routing and translation dictionaries
- API client layer
- form validation

## Routing Strategy

### Public Routes
Suggested route examples:

- /[locale]
- /[locale]/products
- /[locale]/products/[categorySlug]
- /[locale]/product/[productSlug]
- /[locale]/blog
- /[locale]/blog/[postSlug]
- /[locale]/about
- /[locale]/contact
- /[locale]/warranty
- /[locale]/privacy

### Admin Routes
If included in the same app:

- /admin/login
- /admin/dashboard
- /admin/leads
- /admin/leads/[id]
- /admin/products
- /admin/products/new
- /admin/products/[id]
- /admin/categories
- /admin/blog
- /admin/blog/[id]
- /admin/pages
- /admin/media
- /admin/settings
- /admin/users

## Rendering Strategy

### Use server rendering / pre-rendering for:
- homepage
- category pages
- product detail pages
- blog list/detail pages
- static content pages

### Use client-side interactions for:
- forms
- filters
- admin tables
- admin editors
- media selection
- status changes

## i18n Requirements

### Locale Routing
Locale must be part of URL strategy unless business explicitly chooses domain-based localization later.

### Translation Layers
1. code dictionary translations for UI labels
2. backend-fetched translated content for products/posts/pages/categories

### Fallback Rules
- if requested locale content exists, use it
- if missing, fallback to default locale
- missing translation state should be visible in admin

### SEO by Locale
Each locale page needs:
- localized title
- localized meta description
- localized canonical or hreflang strategy

## Page Specifications

### Homepage
Purpose:
- introduce company and product categories
- direct users into product discovery and inquiry

Required blocks:
- hero
- featured categories
- featured products
- company value section
- customization section
- blog/news preview
- CTA section

### Category Listing Page
Purpose:
- show products under a category
- support SEO landing pages

Required:
- category title and summary
- product card grid
- pagination
- inquiry CTA

### Product Detail Page
Purpose:
- convert visits into inquiries

Required:
- product gallery
- title
- short summary
- key specs
- full description
- customization support
- brochure/video if available
- inquiry CTA
- related products

### Blog List Page
Required:
- list of published posts by locale
- pagination
- category filter optional

### Blog Detail Page
Required:
- translated content body
- post metadata
- related CTA

### Static Pages
Required:
- page rendering from CMS-managed content
- locale-aware slug resolution

## Form Behavior

### Shared Requirements
- client validation
- server validation
- locale-aware labels and errors
- anti-spam measures
- success and failure states
- analytics events on submit

### Inquiry Forms
All inquiry forms should send:
- contact info
- locale
- page URL
- referrer if available
- source tracking fields if available
- product reference if applicable

## State Management
Prefer simple local and server state handling.
Do not introduce heavy global state management unless clearly necessary.

Suggested:
- server data fetching per page
- lightweight client hooks for forms and admin interactions

## API Consumption
The frontend should never directly touch the database.
It should consume backend APIs only.

Provide:
- typed API client methods
- unified error handling
- auth-aware admin client
- upload handling abstraction

## Admin UX Requirements
- data tables with filters
- clear edit forms
- translation tabs
- autosave optional, manual save acceptable in V1
- permission-aware UI visibility
- audit-friendly actions

## Responsive Design
The site must work well on:
- desktop
- tablet
- mobile

Priority:
- product detail mobile UX
- inquiry CTA visibility
- readable spec tables
- mobile-friendly forms

## Accessibility
- semantic headings
- labeled form fields
- keyboard usable navigation
- alt text support
- sufficient contrast

## SEO Requirements
- metadata per page
- localized metadata
- clean URLs
- sitemap support
- robots rules
- canonical logic
- structured data for products/articles where feasible

## Error Handling
Provide clear views for:
- 404
- 500
- empty list
- missing translation fallback notice in admin only
