# ATTENTION.md

## Scope Discipline
This project is a B2B trade platform, not a full ecommerce marketplace. Do not overbuild V1.

Avoid adding these in the initial phase unless explicitly required:
- online checkout/payment flow
- multi-vendor architecture
- complex pricing engine
- advanced customer portal
- real-time chat platform
- 3D configurator
- ERP synchronization

## i18n Is Mandatory
Internationalization is a core requirement, not an optional enhancement.

This affects:
- routing
- UI labels
- SEO metadata
- product content
- blog content
- static pages
- inquiry form labels
- validation messages
- email templates where applicable

Never hardcode user-facing text without considering translation strategy.

## CRM Is Core, Not a Side Module
The business value of this website is lead capture and lead management.

Every public conversion path should feed the CRM:
- contact form
- product inquiry
- customization request
- quote request

The backend should preserve:
- source
- referrer
- UTM data if available
- locale
- page context
- inquiry type

## Product Modeling Must Be Structured
Do not model products as simple text blobs only.

Products should support:
- categories
- translated names and descriptions
- specs
- media
- customization options
- downloadable files
- related products
- SEO metadata

## CMS Should Remain Simple
The CMS is for blog/news and static pages, not for building a full no-code site builder in V1.

Keep content capabilities practical:
- title
- slug
- summary
- content body
- SEO fields
- publish state
- locale content

## Admin UX Matters
This project will be operated by humans managing products, content, and leads.

Admin interfaces should prioritize:
- clarity
- low friction
- table views
- filters
- easy edits
- reliable status updates
- useful notes/history

## Validation and Security
All public inputs must be validated both frontend and backend.

Protect:
- admin endpoints
- file upload endpoints
- inquiry forms from spam/abuse
- auth/session secrets
- data export capabilities
- private lead/customer data

## SEO Is Important
The project depends on discoverability and trust.

Do not launch without:
- proper title/meta description logic
- localized metadata
- clean URLs
- canonical logic
- sitemap
- robots rules
- meaningful content structure
- image alt text strategy

## Media Management
Media will grow quickly and can become messy without rules.

Define:
- storage location
- naming rules
- size limits
- type limits
- thumbnail strategy
- alt text handling
- attachment ownership rules

## Translation Strategy Must Be Clear
There are two translation layers:

### 1. Interface Translation
Static UI strings from code/dictionaries.

### 2. Content Translation
Database-backed localized fields for products, posts, and pages.

Do not mix these carelessly.

## Database Design
Avoid storing large important structured content only as a generic JSON blob if it needs filtering, indexing, or reporting.

JSON is acceptable for:
- flexible specs
- extra metadata
- tracking payloads

But use normal columns/tables for:
- statuses
- names
- slugs
- relations
- dates
- ownership
- permissions

## Logging and Audit
Track key admin operations:
- product creation/update
- category changes
- page publish/unpublish
- lead status changes
- role changes
- media deletion

This is important for internal control.

## Deployment Caution
Keep deployment simple.

Recommended V1 mindset:
- one frontend app
- one backend app
- one PostgreSQL instance
- one storage solution

Avoid unnecessary distributed complexity early.

## Content Population
Even a well-built system will fail if content is weak.

Before launch, prepare:
- at least several complete product entries
- category descriptions
- trust pages
- warranty/privacy text
- several blog posts
- translated content for supported locales
