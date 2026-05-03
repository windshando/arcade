# API_SPEC.md

## Overview
The backend exposes APIs for the public website and admin system.

API design goals:
- predictable RESTful endpoints
- strict validation
- role-based access control for admin endpoints
- locale-aware content fetching
- structured inquiry intake
- maintainable versioning

Suggested prefix:
- /api/v1

---

## 1. Auth

### POST /api/v1/auth/login
Admin login.

Request:
- email
- password

Response:
- access token / session data
- admin profile
- roles/permissions summary

### POST /api/v1/auth/logout
Invalidate session/token if applicable.

### GET /api/v1/auth/me
Return current admin user profile.

---

## 2. Product Categories

### GET /api/v1/public/categories
Return published categories for a locale.

Query:
- locale

### GET /api/v1/public/categories/:slug
Return category detail with localized content.

Query:
- locale
- page optional

### GET /api/v1/admin/categories
List categories.

### POST /api/v1/admin/categories
Create category.

### GET /api/v1/admin/categories/:id
Get category detail for admin edit.

### PUT /api/v1/admin/categories/:id
Update category.

### DELETE /api/v1/admin/categories/:id
Archive or delete category depending on policy.

---

## 3. Products

### GET /api/v1/public/products
List published products.

Query:
- locale
- categorySlug optional
- page
- pageSize

### GET /api/v1/public/products/:slug
Get published product detail by localized slug.

Query:
- locale

### GET /api/v1/admin/products
Admin product list with filters.

Query:
- status
- categoryId
- search
- page
- pageSize

### POST /api/v1/admin/products
Create product.

### GET /api/v1/admin/products/:id
Get product detail for admin.

### PUT /api/v1/admin/products/:id
Update product base fields.

### PUT /api/v1/admin/products/:id/translations/:locale
Update localized product content.

### PUT /api/v1/admin/products/:id/specs
Replace or update product specs.

### PUT /api/v1/admin/products/:id/customization-options
Update customization options.

### PUT /api/v1/admin/products/:id/related
Update related products.

### DELETE /api/v1/admin/products/:id
Archive product.

---

## 4. Blog / CMS

### GET /api/v1/public/posts
List published posts.

Query:
- locale
- categorySlug optional
- page
- pageSize

### GET /api/v1/public/posts/:slug
Get post detail by localized slug.

Query:
- locale

### GET /api/v1/admin/posts
Admin list with filters.

### POST /api/v1/admin/posts
Create post.

### GET /api/v1/admin/posts/:id
Get admin post detail.

### PUT /api/v1/admin/posts/:id
Update post base fields.

### PUT /api/v1/admin/posts/:id/translations/:locale
Update localized post content.

### DELETE /api/v1/admin/posts/:id
Archive post.

---

## 5. Static Pages

### GET /api/v1/public/pages/:slug
Get page by localized slug.

Query:
- locale

### GET /api/v1/admin/pages
List pages.

### GET /api/v1/admin/pages/:id
Get page detail.

### PUT /api/v1/admin/pages/:id
Update page base fields.

### PUT /api/v1/admin/pages/:id/translations/:locale
Update localized page content.

---

## 6. Inquiry / CRM Intake

### POST /api/v1/public/inquiries/contact
Create general contact inquiry.

### POST /api/v1/public/inquiries/product
Create product inquiry.

### POST /api/v1/public/inquiries/quote
Create quote request.

### POST /api/v1/public/inquiries/customization
Create customization request.

Shared request shape:
- locale
- contact_name
- company_name optional
- email optional
- phone optional
- whatsapp optional
- wechat optional
- country_code
- message
- product_id optional
- quantity optional
- customization_request optional
- source fields optional

Shared response:
- success boolean
- inquiry_id
- lead_id if created immediately
- localized user message

Behavior:
- persist raw inquiry
- create or link customer/contact if possible
- create lead
- log source and page context
- trigger notification workflow if configured

---

## 7. CRM Admin

### GET /api/v1/admin/leads
List leads.

Filters:
- status
- assignedAdminId
- sourceChannel
- locale
- search
- dateFrom/dateTo

### GET /api/v1/admin/leads/:id
Get lead detail.

### PUT /api/v1/admin/leads/:id
Update lead fields.

### POST /api/v1/admin/leads/:id/notes
Add internal note.

### GET /api/v1/admin/leads/:id/activities
Get lead activities.

### POST /api/v1/admin/leads/:id/assign
Assign lead to admin.

### POST /api/v1/admin/leads/:id/status
Change lead status.

### GET /api/v1/admin/customers
List customers.

### GET /api/v1/admin/customers/:id
Get customer detail.

### PUT /api/v1/admin/customers/:id
Update customer.

---

## 8. Media

### POST /api/v1/admin/media/upload
Upload a file.

### GET /api/v1/admin/media
List media assets.

### GET /api/v1/admin/media/:id
Get media detail.

### DELETE /api/v1/admin/media/:id
Delete or soft delete based on policy.

Validation:
- allowed mime types
- size limits
- auth required

---

## 9. Settings / i18n

### GET /api/v1/admin/settings
Get settings.

### PUT /api/v1/admin/settings
Update settings.

Important settings:
- supported_locales
- default_locale
- contact channels
- SEO defaults
- analytics/tracking settings

---

## 10. Users / Roles / Permissions

### GET /api/v1/admin/users
List admin users.

### POST /api/v1/admin/users
Create admin user.

### PUT /api/v1/admin/users/:id
Update admin user.

### GET /api/v1/admin/roles
List roles.

### POST /api/v1/admin/roles
Create role.

### PUT /api/v1/admin/roles/:id
Update role and permissions.

---

## Validation Rules
- all admin endpoints require auth
- role/permission checks required for writes
- public form endpoints require server validation
- locale input must be validated against supported locales
- slugs must be unique by locale within entity scope

## Error Response Format
Suggested shape:
- code
- message
- details optional
- fieldErrors optional

## Versioning
Use URI versioning for V1:
- /api/v1
