# BACKEND_IMPLEMENTATION.md

## Overview
The backend is responsible for:

- authentication and authorization
- business logic
- API delivery
- data persistence
- i18n-aware content retrieval
- inquiry-to-lead conversion
- media metadata management
- audit logging

Recommended stack:
- NestJS
- Prisma ORM
- PostgreSQL

## Suggested Backend Module Structure

- auth
- users
- roles
- permissions
- products
- product-categories
- posts
- post-categories
- static-pages
- inquiries
- leads
- customers
- media
- settings
- audit-logs
- common
- i18n

## Folder Strategy Example

```text
src/
  modules/
    auth/
    users/
    roles/
    permissions/
    leads/
    customers/
    inquiries/
    products/
    product-categories/
    posts/
    post-categories/
    static-pages/
    media/
    settings/
    audit-logs/
  common/
    decorators/
    dto/
    enums/
    filters/
    guards/
    interceptors/
    pipes/
    utils/
  prisma/
  main.ts
```

## Auth Strategy
Use admin-only authentication in V1.

Recommended:
- JWT or secure session strategy
- bcrypt/argon2 for password hashing
- role-based authorization guard
- permission decorator helpers

No public user account system is required in V1.

## Prisma Strategy
Use Prisma as the database access layer.

Guidelines:
- define schema with clear relations
- keep translations in separate tables
- use migrations for all schema changes
- avoid bypassing Prisma with raw SQL except where justified
- seed base data for roles, permissions, locales, and sample content

## Translation Implementation Strategy

### Static Interface Translation
Not handled by backend except perhaps returning configured supported locales.

### Content Translation
Handled in database with translation tables.

Backend responsibilities:
- validate locale
- fetch translated record for requested locale
- fallback to default locale if missing
- expose missing translation state to admin clients if useful

## Public Content Read Logic
For public endpoints:
1. validate locale
2. fetch entity by localized slug or by entity id relation
3. if translation not found, fallback to default locale
4. return normalized payload to frontend

## Inquiry to Lead Flow
When a public inquiry is submitted:

1. validate input
2. persist raw inquiry
3. find or create customer/contact records where possible
4. create lead
5. create lead activity entry
6. optionally notify internal team by email/webhook
7. return success response

Do not lose raw inquiry payload even if CRM linking is imperfect.

## Lead Status Change Flow
When admin changes lead status:
1. validate permission
2. update lead
3. create lead activity log
4. create audit log if needed

## Media Handling
Backend should:
- validate uploaded file type and size
- write file to configured storage provider
- store media metadata in database
- expose asset URLs securely
- support asset linking to products/posts/pages

## Audit Logging
Audit at least:
- create/update/delete/archive actions
- publish/unpublish actions
- lead assignment/status changes
- role/permission changes

Suggested audit payload:
- actor
- entity_type
- entity_id
- action
- before_json
- after_json
- created_at

## DTO and Validation
Use DTOs and class validation consistently.

Validate:
- emails
- phone-like fields
- locale values
- enum values
- slug format
- published status transitions
- file upload metadata
- required translation fields for default locale

## Error Handling
Provide a unified exception filter.

Goals:
- predictable response shape
- hide internal implementation details
- include field-level validation errors when applicable

## Pagination and Filtering
All admin list endpoints should support:
- page
- pageSize
- search
- relevant filters

Public listing endpoints should support:
- page
- pageSize
- locale
- category filter where relevant

## SEO Data Support
Backend should persist and expose:
- SEO title
- SEO description
- slug
- published_at
- canonical override optional in future

## Settings Support
Settings should cover:
- supported locales
- default locale
- company contact data
- social links
- SEO defaults
- optional analytics config

## Security Notes
- do not trust frontend validation alone
- rate limit public write endpoints
- sanitize rich text content rendering paths
- secure admin endpoints with guards
- protect upload endpoints
- protect secrets via environment variables

## Testing Recommendations
Backend should include:
- unit tests for core services
- integration tests for inquiry creation
- integration tests for locale fallback retrieval
- auth guard tests
- permission tests
- migration verification in staging

## Deployment Notes
At deployment time:
- ensure environment variables exist
- run prisma migrate deploy
- run seed only where appropriate
- start application in production mode
- confirm database connectivity
- confirm storage and email services if enabled
