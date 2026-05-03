# ENGINERRING_PRINCIPLES.md

## 1. Build for Business Value
The purpose of the system is to support B2B lead generation and trade operations.
Prefer solutions that improve:
- inquiry conversion
- lead clarity
- content manageability
- product presentation
- multilingual maintainability

## 2. Keep V1 Focused
Do not add architecture or features that do not materially support V1 goals.

## 3. i18n by Design
Internationalization is a system-level concern.
Do not treat it as a later patch.

All user-facing content must belong to one of:
- code-level translation
- database-level translation

## 4. Strong Data Structure
Structured data should remain structured.
Do not collapse important relational business entities into generic blobs.

## 5. Clear Separation of Concerns
- frontend renders and interacts
- backend validates and executes business logic
- database persists normalized data
- storage manages files

## 6. API First Thinking
All significant business operations should be modeled clearly in the API.
Avoid hidden, duplicated business logic across the frontend.

## 7. Default to Simplicity
Choose the simplest design that keeps future growth possible.

Examples:
- separate translation tables instead of overengineered localization service
- standard REST APIs instead of premature GraphQL
- simple RBAC instead of overcomplicated policy engines

## 8. Human-Operated Admin First
The admin system must be understandable and efficient for internal operators.
Optimize for:
- clarity
- editability
- traceability
- low training burden

## 9. Preserve Raw Business Signals
Never discard useful inbound lead context.
Always try to retain:
- source
- locale
- page context
- message
- channel information
- timestamps

## 10. SEO-Friendly Architecture
Public content should support search engine visibility by design:
- stable URLs
- renderable content
- locale-aware metadata
- clear headings and semantic structure

## 11. Safe by Default
Protect admin and customer-related data.
Security is not optional.

## 12. Auditable Operations
Important content and CRM changes should be traceable.

## 13. Avoid Lock-In Where Possible
Use widely understood and maintainable patterns.
Prefer portable architecture and conventional deployment.

## 14. Content Is a Product Surface
The CMS and page systems should be practical and easy to operate.
Engineering should support content teams, not block them.

## 15. Optimize for Evolution
Design the system so future additions are possible:
- more locales
- richer CRM
- quotation workflows
- more product attributes
- external integrations

But do not implement those future features prematurely.
