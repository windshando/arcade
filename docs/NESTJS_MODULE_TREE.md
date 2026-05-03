# NESTJS_MODULE_TREE.md

## Recommended backend module tree

```text
apps/
  api/
    src/
      main.ts
      app.module.ts
      common/
        constants/
        decorators/
        dto/
        exceptions/
        filters/
        guards/
        interceptors/
        pipes/
        types/
        utils/
      config/
        app.config.ts
        database.config.ts
        i18n.config.ts
        storage.config.ts
      prisma/
        prisma.module.ts
        prisma.service.ts
      auth/
        auth.module.ts
        auth.controller.ts
        auth.service.ts
        strategies/
        guards/
        dto/
      admin-users/
        admin-users.module.ts
        admin-users.controller.ts
        admin-users.service.ts
        dto/
      locales/
        locales.module.ts
        locales.controller.ts
        locales.service.ts
      lead-sources/
        lead-sources.module.ts
        lead-sources.controller.ts
        lead-sources.service.ts
      customers/
        customers.module.ts
        customers.controller.ts
        customers.service.ts
        dto/
      contacts/
        contacts.module.ts
        contacts.controller.ts
        contacts.service.ts
        dto/
      inquiries/
        inquiries.module.ts
        inquiries.controller.ts
        inquiries.service.ts
        dto/
      crm/
        crm.module.ts
        crm.controller.ts
        crm.service.ts
        dto/
      categories/
        categories.module.ts
        categories.controller.ts
        categories.service.ts
        dto/
      products/
        products.module.ts
        products.controller.ts
        products.service.ts
        dto/
      media/
        media.module.ts
        media.controller.ts
        media.service.ts
        dto/
      blog/
        blog.module.ts
        blog.controller.ts
        blog.service.ts
        dto/
      static-pages/
        static-pages.module.ts
        static-pages.controller.ts
        static-pages.service.ts
        dto/
      seo/
        seo.module.ts
        seo.service.ts
      site-settings/
        site-settings.module.ts
        site-settings.controller.ts
        site-settings.service.ts
      audit-logs/
        audit-logs.module.ts
        audit-logs.controller.ts
        audit-logs.service.ts
      health/
        health.module.ts
        health.controller.ts
```

## Module responsibilities

### auth
- Admin login
- JWT issue / refresh
- Role guard
- Session invalidation strategy if needed

### admin-users
- Manage admin accounts
- Role assignment
- Password reset by super admin

### locales
- Enabled locales
- Default locale
- Locale metadata for frontend

### lead-sources
- UTM source normalization
- Manual lead source setup
- Source labels for CRM reporting

### customers / contacts
- Company records
- Contact persons
- Preferred contact methods

### inquiries
- Public form intake
- Internal inquiry listing / filtering
- Assignment and status changes

### crm
- Lead notes
- Lead activities
- Timeline aggregation
- Simple reporting endpoints

### categories / products
- Product taxonomy
- Product CRUD
- Product translations
- Product specs and customization options

### media
- Upload metadata
- Media linking
- Validation and signed URL helpers if needed

### blog
- Blog category CRUD
- Post CRUD
- Translation support
- Publish / unpublish

### static-pages
- About / Contact / Warranty / Privacy / Terms / FAQ
- Translation support

### site-settings
- Brand settings
- Contact channels
- Footer config
- SEO defaults

### audit-logs
- Admin write actions
- Sensitive changes

## Suggested controller split

- Public controllers return only public published content.
- Admin controllers require JWT + role checks.
- Avoid mixing admin write endpoints into public controllers.

## Recommended route groups

```text
/api/v1/public/...
/api/v1/admin/...
/api/v1/auth/...
```

## Notes for AI developer

- Keep DTOs explicit and narrow.
- Prefer service-level orchestration over controller-heavy logic.
- Add locale-aware serializers for translated entities.
- Never expose draft content in public endpoints.
