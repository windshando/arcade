# UI_COMPONENTS_TREE.md

## Public Website

### AppShell
- Header
  - Logo
  - PrimaryNav
  - LocaleSwitcher
  - ContactQuickActions
  - MobileMenuTrigger
- Footer
  - FooterNav
  - ContactInfo
  - SocialLinks
  - LegalLinks
  - LocaleSwitcherOptional

---

## Global Shared Components
- Container
- SectionHeader
- Breadcrumbs
- CTAButton
- SecondaryButton
- InquiryButton
- QuoteButton
- Tag
- Badge
- EmptyState
- LoadingState
- ErrorState
- Pagination
- LocaleSwitcher
- LanguageAwareLink
- SEOHead helper
- RichTextRenderer
- MediaImage
- MediaGallery
- VideoEmbed
- DownloadCard
- InfoList
- SpecTable
- Accordion
- Tabs
- Modal
- Toast
- FormField
- FormTextarea
- FormSelect
- CountrySelect
- PhoneInput
- ContactMethodGroup
- SubmitBar

---

## Public Pages

### Homepage
- HeroSection
- ProductCategoryGrid
- FeaturedProductsSection
- WhyChooseUsSection
- CustomizationSection
- SolutionsSection optional
- BlogPreviewSection
- InquiryCTASection
- FooterCTA

### Category Page
- CategoryHero
- CategoryDescription
- FilterBar optional for V1
- ProductCardGrid
- Pagination
- BottomInquiryBanner

### Product Detail Page
- ProductHero
  - ProductGallery
  - ProductSummaryCard
  - InquiryCTA
- ProductSpecSection
- ProductDescriptionSection
- ProductCustomizationSection
- DownloadSection
- RelatedProductsSection
- FAQSection optional
- StickyInquiryBar mobile

### Blog List Page
- BlogHero
- BlogFilterTabs optional
- PostCardGrid
- Pagination

### Blog Detail Page
- PostHero
- PostMeta
- RichTextContent
- RelatedPosts optional
- ContactCTA

### Static Pages
- AboutPage
- ContactPage
- WarrantyPage
- PrivacyPage
- TermsPage
- FAQPage optional

### Contact Page
- ContactInfoPanel
- ContactForm
- ContactMethodCards
- MapOrOfficeCard optional

### Customization Page
- CustomizationIntro
- SupportedCustomizationTypes
- ProductReferenceSelector optional
- CustomizationInquiryForm

---

## Forms

### General Contact Form
- name
- company
- email
- phone
- whatsapp
- wechat
- country
- message
- consent checkbox
- submit button

### Product Inquiry Form
- product reference
- name
- company
- email
- phone
- whatsapp
- wechat
- country
- quantity
- message
- submit button

### Quote Request Form
- product reference
- quantity
- destination country/port
- customization needed
- contact fields
- message

### Customization Request Form
- product reference
- customization options
- text details
- attachment optional in future
- contact fields

---

## Cards and Lists

### ProductCard
- cover image
- product name
- short summary
- spec highlights
- CTA buttons

### CategoryCard
- category image
- category name
- short description
- CTA

### PostCard
- cover image
- title
- summary
- publish date
- CTA

### LeadSourceBadge
- source label
- source type

---

## Admin System

### AdminShell
- Sidebar
  - Dashboard
  - Leads
  - Customers
  - Products
  - Categories
  - Blog
  - Static Pages
  - Media Library
  - Settings
  - Users / Roles
- Topbar
  - Search optional
  - Current user menu
  - Locale preview switch optional

---

## Admin Pages

### Dashboard
- KPI cards
- Recent inquiries table
- Recent leads table
- Recent content updates
- Quick actions

### Leads List Page
- LeadFilters
- LeadTable
- BulkActions optional
- Pagination

### Lead Detail Page
- LeadSummaryCard
- ContactInfoCard
- SourceInfoCard
- InquiryPayloadCard
- NotesPanel
- ActivityTimeline
- StatusUpdatePanel
- AssignmentPanel

### Customers List Page
- CustomerTable
- Filters
- Search

### Product List Page
- ProductFilters
- ProductTable
- CreateProductButton

### Product Edit Page
- BaseInfoForm
- TranslationTabs
- SpecsEditor
- MediaPicker
- CustomizationOptionsEditor
- RelatedProductsSelector
- SEOFields
- PublishControls

### Category Management
- CategoryTree
- CategoryEditPanel
- TranslationFields
- SEOFields

### Blog List Page
- PostTable
- Filters
- CreatePostButton

### Blog Edit Page
- TranslationTabs
- RichTextEditor
- CoverMediaPicker
- SEOFields
- PublishControls

### Static Page Management
- StaticPageTable
- PageTranslationEditor
- SEOFields
- PublishControls

### Media Library
- UploadButton
- MediaGrid
- MediaSearch
- MediaDetailDrawer

### Settings
- SiteLocalesSettings
- DefaultLocaleSetting
- ContactSettings
- SocialSettings
- SEOSettings
- TrackingSettings

### Users / Roles
- AdminUserTable
- RoleTable
- PermissionMatrix

---

## i18n-Specific UI Requirements
- locale switcher visible in public header
- admin translation tabs for translatable entities
- fallback indicator when a locale translation is missing
- preview mode for locale-specific content
- validation per locale where required
