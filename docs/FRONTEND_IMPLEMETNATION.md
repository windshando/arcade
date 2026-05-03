# FRONTEND_IMPLEMETNATION.md

## Overview
This document describes how the frontend should be implemented in practice.

## Recommended App Structure

```text
app/
  [locale]/
    layout.tsx
    page.tsx
    products/
      page.tsx
      [categorySlug]/
        page.tsx
    product/
      [productSlug]/
        page.tsx
    blog/
      page.tsx
      [postSlug]/
        page.tsx
    about/
      page.tsx
    contact/
      page.tsx
    warranty/
      page.tsx
    privacy/
      page.tsx
  admin/
    login/
      page.tsx
    dashboard/
      page.tsx
    leads/
      page.tsx
      [id]/
        page.tsx
    products/
      page.tsx
      new/
        page.tsx
      [id]/
        page.tsx
    categories/
      page.tsx
    blog/
      page.tsx
      [id]/
        page.tsx
    pages/
      page.tsx
    media/
      page.tsx
    settings/
      page.tsx
components/
lib/
messages/
```

## Layout Strategy

### Public Layout
Should include:
- header
- footer
- locale switch
- responsive navigation
- inquiry CTA visibility

### Admin Layout
Should include:
- sidebar
- top bar
- auth gate
- breadcrumb
- section header
- table/action layouts

## Data Fetching Strategy

### Public Pages
Use server data fetching for content-heavy pages:
- homepage
- categories
- product detail
- blog pages
- static pages

### Admin Pages
Use protected API calls and client-side interaction where suitable:
- tables
- editors
- status changes
- media uploads

## i18n Implementation

### Dictionary Files
Store UI translations in locale dictionaries:
- messages/en.json
- messages/zh-CN.json
- messages/ja.json

### Locale Segment
Use route locale segment consistently.

### Content Fetch Requests
Every content fetch should include locale context.

Example intent:
- fetch product by slug + locale
- fetch page by slug + locale
- fetch posts by locale

### Fallback Handling
If translation missing:
- public side: use fallback locale content
- admin side: visibly mark missing locale translation

## Shared UI System
Create a reusable design system with:
- buttons
- inputs
- textareas
- selects
- tables
- cards
- modals
- badges
- section wrappers

Avoid one-off components when a shared version makes sense.

## Form Implementation

### Validation
Use:
- frontend validation for UX
- backend validation as source of truth

### Inquiry Forms
Build one reusable inquiry form engine with variants:
- contact
- product inquiry
- quote request
- customization request

Each variant can toggle fields rather than duplicating full form logic.

## Product Page Implementation
The product detail page should be built from modular blocks:
- gallery
- summary
- CTA panel
- specs
- description
- customization
- downloads
- related products

This keeps page evolution easier.

## Admin Translation Editors
For products/posts/pages/categories:
- use locale tabs
- separate base fields from localized fields
- clearly indicate required fields for default locale
- allow save by locale section

## SEO Metadata Implementation
Each public page should generate metadata from server-fetched localized content.

Priority order:
1. localized SEO fields
2. localized title/summary fallback
3. global site defaults

## Error/Loading UI
Create reusable states for:
- loading skeletons
- empty list results
- fetch errors
- unauthorized admin access
- not found pages

## API Client Layer
Create typed wrappers around backend endpoints.

Separate:
- public content client
- admin authenticated client

## Performance Considerations
- optimize images
- lazy load non-critical media
- keep large admin tables paginated
- avoid unnecessary client components
- prefer server rendering for SEO pages

## Quality Checks
Before merge, verify:
- locale switching works
- metadata changes by locale
- forms submit correctly
- responsive product page works
- admin translation forms save correctly
