# NEXTJS_FOLDER_TREE.md

## Recommended frontend folder tree

```text
apps/
  web/
    src/
      app/
        [locale]/
          layout.tsx
          page.tsx
          about/page.tsx
          contact/page.tsx
          warranty/page.tsx
          privacy/page.tsx
          faq/page.tsx
          products/page.tsx
          products/[categorySlug]/page.tsx
          product/[slug]/page.tsx
          customization/page.tsx
          blog/page.tsx
          blog/[slug]/page.tsx
          quote/page.tsx
          not-found.tsx
        admin/
          login/page.tsx
          dashboard/page.tsx
          customers/page.tsx
          inquiries/page.tsx
          products/page.tsx
          products/new/page.tsx
          products/[id]/page.tsx
          categories/page.tsx
          blog/page.tsx
          pages/page.tsx
          settings/page.tsx
      components/
        common/
        layout/
        seo/
        forms/
        product/
        blog/
        crm/
        admin/
      features/
        locale/
        auth/
        products/
        blog/
        inquiries/
        crm/
        settings/
      lib/
        api/
          client.ts
          public.ts
          admin.ts
        constants/
        formatters/
        validators/
        utils/
      hooks/
      messages/
        en.json
        zh-CN.json
        ja.json
        ar.json
      styles/
        globals.css
      middleware.ts
      i18n/
        routing.ts
        request.ts
        config.ts
```

## Route philosophy

### Public site
- All public routes live under `[locale]`.
- Locale segment is required for consistency and SEO clarity.
- Example:
  - `/en/products`
  - `/zh-CN/products`

### Admin site
Two valid choices:
1. Keep admin outside locale routes for simplicity.
2. Add locale-aware admin later if required.

Recommended for v1:
- `/admin/login`
- `/admin/dashboard`

## Feature ownership

### features/products
- Product list fetchers
- Product detail data mapping
- Category navigation helpers

### features/blog
- Blog list/detail mapping
- Published-state handling

### features/inquiries
- Quote form and contact form clients
- Tracking parameter persistence

### features/locale
- Locale switcher logic
- Translation loading
- fallback behavior

## Notes for AI developer

- Keep page files thin; move logic into feature modules.
- All labels and messages must come from locale dictionaries.
- Use typed API clients and typed response mappers.
- Public UI must render without admin dependencies.
