# DATA_MODELS.md

## Overview
The system contains six major data domains:

1. admin/auth
2. CRM/leads/customers
3. products/categories/customization
4. CMS/blog
5. static pages/site settings
6. i18n/media/audit

---

## 1. Admin / Auth

### AdminUser
Represents an internal operator.

Fields:
- id
- email
- password_hash
- name
- status
- last_login_at
- created_at
- updated_at

### Role
Represents a role such as super_admin, editor, sales_manager, content_editor.

Fields:
- id
- code
- name
- description

### Permission
Represents a permission unit.

Fields:
- id
- code
- name
- description

### AdminUserRole
Join table between admin users and roles.

### RolePermission
Join table between roles and permissions.

---

## 2. CRM / Leads / Customers

### Customer
Represents a company or buyer organization.

Fields:
- id
- company_name
- country_code
- website
- source
- notes
- created_at
- updated_at

### Contact
Represents a person related to a customer or lead.

Fields:
- id
- customer_id nullable
- first_name
- last_name
- full_name
- email
- phone
- whatsapp
- wechat
- job_title
- preferred_contact_method
- locale
- created_at
- updated_at

### Lead
Represents a tracked sales opportunity created from an inquiry or manual entry.

Fields:
- id
- customer_id nullable
- primary_contact_id nullable
- inquiry_type
- status
- priority
- source_channel
- source_detail
- landing_page_url
- referrer_url
- utm_source
- utm_medium
- utm_campaign
- utm_term
- utm_content
- locale
- assigned_admin_id nullable
- summary
- budget_range
- target_market
- requested_quantity
- shipping_destination
- next_action_at nullable
- created_at
- updated_at

### LeadNote
Internal note attached to a lead.

Fields:
- id
- lead_id
- admin_user_id
- content
- created_at

### LeadActivity
Activity timeline record.

Fields:
- id
- lead_id
- admin_user_id nullable
- activity_type
- payload_json
- created_at

### Inquiry
Raw inbound form submission.

Fields:
- id
- lead_id nullable
- inquiry_type
- product_id nullable
- locale
- contact_name
- company_name
- email
- phone
- whatsapp
- wechat
- country_code
- message
- customization_request
- source_channel
- landing_page_url
- referrer_url
- utm_json
- user_agent
- ip_hash_or_masked
- created_at

---

## 3. Products

### ProductCategory
Category tree for products.

Fields:
- id
- parent_id nullable
- code
- sort_order
- is_active
- created_at
- updated_at

### ProductCategoryTranslation
Localized content for categories.

Fields:
- id
- category_id
- locale
- name
- slug
- summary
- description
- seo_title
- seo_description

### Product
Main product entity.

Fields:
- id
- sku
- category_id
- status
- is_featured
- sort_order
- cover_media_id nullable
- brochure_media_id nullable
- video_url nullable
- moq nullable
- lead_time_days nullable
- warranty_months nullable
- target_venue nullable
- dimensions nullable
- weight_kg nullable
- power_spec nullable
- voltage_spec nullable
- packaging_info nullable
- customization_enabled
- published_at nullable
- created_at
- updated_at

### ProductTranslation
Localized product content.

Fields:
- id
- product_id
- locale
- name
- slug
- short_description
- description
- seo_title
- seo_description
- meta_keywords nullable

### ProductSpec
Structured specifications for display and filtering.

Fields:
- id
- product_id
- spec_key
- spec_value
- sort_order

Note:
Use this for structured rows like:
- screen size
- player count
- power
- voltage
- machine size

### ProductMedia
Product gallery relation.

Fields:
- id
- product_id
- media_id
- sort_order
- media_role

### ProductCustomizationOption
Supported customization choices.

Fields:
- id
- product_id
- option_code
- option_type
- is_required
- sort_order
- config_json nullable

### ProductCustomizationOptionTranslation
Localized label/help text for customization options.

Fields:
- id
- customization_option_id
- locale
- label
- help_text

### ProductRelated
Links between products.

Fields:
- id
- product_id
- related_product_id
- sort_order

---

## 4. CMS / Blog

### PostCategory
Blog/news category.

Fields:
- id
- code
- sort_order
- is_active
- created_at
- updated_at

### PostCategoryTranslation
Localized category content.

Fields:
- id
- post_category_id
- locale
- name
- slug
- seo_title
- seo_description

### Post
Article entity.

Fields:
- id
- category_id nullable
- author_admin_id nullable
- status
- cover_media_id nullable
- published_at nullable
- created_at
- updated_at

### PostTranslation
Localized article content.

Fields:
- id
- post_id
- locale
- title
- slug
- summary
- content
- seo_title
- seo_description

---

## 5. Static Pages / Settings

### StaticPage
Represents a page such as about, contact, warranty, privacy.

Fields:
- id
- page_key
- status
- created_at
- updated_at

### StaticPageTranslation
Localized page content.

Fields:
- id
- static_page_id
- locale
- title
- slug
- content
- seo_title
- seo_description

### SiteSetting
Key-value configuration.

Fields:
- id
- setting_key
- setting_value_json
- updated_at

Examples:
- supported_locales
- default_locale
- contact email
- social links
- tracking settings

---

## 6. Media / Audit / Shared

### MediaAsset
Uploaded files.

Fields:
- id
- storage_provider
- storage_key
- original_filename
- mime_type
- file_size
- width nullable
- height nullable
- alt_text nullable
- uploaded_by_admin_id nullable
- created_at

### AuditLog
Admin operation log.

Fields:
- id
- admin_user_id nullable
- entity_type
- entity_id
- action
- before_json nullable
- after_json nullable
- created_at

---

## i18n Strategy

### Code-Level i18n
Stored in translation dictionaries in the frontend codebase for UI labels and system copy.

### Database-Level i18n
Stored in translation tables for:
- product categories
- products
- post categories
- posts
- static pages
- customization option labels

### Locale Strategy
Recommended V1:
- default locale: en
- additional locale(s): zh-CN, ja, ar, etc. depending on business need

Each translatable table should have:
- locale
- unique constraint on parent_id + locale
- fallback behavior handled in application layer

---

## Suggested Enums

### LeadStatus
- new
- contacted
- qualified
- quoted
- negotiating
- won
- lost
- invalid

### InquiryType
- general_contact
- product_inquiry
- quote_request
- customization_request

### PublishStatus
- draft
- published
- archived

### AdminStatus
- active
- disabled

### ProductStatus
- draft
- published
- archived
