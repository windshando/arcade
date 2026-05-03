-- database_schema.sql
-- PostgreSQL schema for arcade trade website V1

CREATE TABLE admin_users (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name VARCHAR(120) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  description TEXT
);

CREATE TABLE admin_user_roles (
  admin_user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (admin_user_id, role_id)
);

CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE customers (
  id BIGSERIAL PRIMARY KEY,
  company_name VARCHAR(255),
  country_code VARCHAR(10),
  website VARCHAR(255),
  source VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE contacts (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  full_name VARCHAR(200),
  email VARCHAR(255),
  phone VARCHAR(80),
  whatsapp VARCHAR(80),
  wechat VARCHAR(120),
  job_title VARCHAR(120),
  preferred_contact_method VARCHAR(50),
  locale VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE leads (
  id BIGSERIAL PRIMARY KEY,
  customer_id BIGINT REFERENCES customers(id) ON DELETE SET NULL,
  primary_contact_id BIGINT REFERENCES contacts(id) ON DELETE SET NULL,
  inquiry_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  priority VARCHAR(30),
  source_channel VARCHAR(100),
  source_detail VARCHAR(255),
  landing_page_url TEXT,
  referrer_url TEXT,
  utm_source VARCHAR(150),
  utm_medium VARCHAR(150),
  utm_campaign VARCHAR(150),
  utm_term VARCHAR(150),
  utm_content VARCHAR(150),
  locale VARCHAR(20),
  assigned_admin_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  summary TEXT,
  budget_range VARCHAR(100),
  target_market VARCHAR(150),
  requested_quantity INTEGER,
  shipping_destination VARCHAR(150),
  next_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_notes (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  admin_user_id BIGINT NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lead_activities (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  admin_user_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  activity_type VARCHAR(80) NOT NULL,
  payload_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE media_assets (
  id BIGSERIAL PRIMARY KEY,
  storage_provider VARCHAR(50) NOT NULL,
  storage_key TEXT NOT NULL,
  original_filename VARCHAR(255) NOT NULL,
  mime_type VARCHAR(120) NOT NULL,
  file_size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_by_admin_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_categories (
  id BIGSERIAL PRIMARY KEY,
  parent_id BIGINT REFERENCES product_categories(id) ON DELETE SET NULL,
  code VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_category_translations (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary TEXT,
  description TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  UNIQUE (category_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  sku VARCHAR(100) UNIQUE,
  category_id BIGINT NOT NULL REFERENCES product_categories(id) ON DELETE RESTRICT,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  cover_media_id BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  brochure_media_id BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  video_url TEXT,
  moq INTEGER,
  lead_time_days INTEGER,
  warranty_months INTEGER,
  target_venue VARCHAR(150),
  dimensions VARCHAR(150),
  weight_kg NUMERIC(10,2),
  power_spec VARCHAR(100),
  voltage_spec VARCHAR(100),
  packaging_info TEXT,
  customization_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE product_translations (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  short_description TEXT,
  description TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  meta_keywords TEXT,
  UNIQUE (product_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE product_specs (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  spec_key VARCHAR(120) NOT NULL,
  spec_value TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE product_media (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id BIGINT NOT NULL REFERENCES media_assets(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  media_role VARCHAR(50) NOT NULL DEFAULT 'gallery'
);

CREATE TABLE product_customization_options (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  option_code VARCHAR(100) NOT NULL,
  option_type VARCHAR(50) NOT NULL,
  is_required BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  config_json JSONB,
  UNIQUE (product_id, option_code)
);

CREATE TABLE product_customization_option_translations (
  id BIGSERIAL PRIMARY KEY,
  customization_option_id BIGINT NOT NULL REFERENCES product_customization_options(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  label VARCHAR(255) NOT NULL,
  help_text TEXT,
  UNIQUE (customization_option_id, locale)
);

CREATE TABLE product_related (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  related_product_id BIGINT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE (product_id, related_product_id)
);

CREATE TABLE inquiries (
  id BIGSERIAL PRIMARY KEY,
  lead_id BIGINT REFERENCES leads(id) ON DELETE SET NULL,
  inquiry_type VARCHAR(50) NOT NULL,
  product_id BIGINT REFERENCES products(id) ON DELETE SET NULL,
  locale VARCHAR(20),
  contact_name VARCHAR(200),
  company_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(80),
  whatsapp VARCHAR(80),
  wechat VARCHAR(120),
  country_code VARCHAR(10),
  message TEXT,
  customization_request TEXT,
  source_channel VARCHAR(100),
  landing_page_url TEXT,
  referrer_url TEXT,
  utm_json JSONB,
  user_agent TEXT,
  ip_hash_or_masked VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_categories (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_category_translations (
  id BIGSERIAL PRIMARY KEY,
  post_category_id BIGINT NOT NULL REFERENCES post_categories(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  seo_title VARCHAR(255),
  seo_description TEXT,
  UNIQUE (post_category_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT REFERENCES post_categories(id) ON DELETE SET NULL,
  author_admin_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  cover_media_id BIGINT REFERENCES media_assets(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_translations (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  summary TEXT,
  content TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  UNIQUE (post_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE static_pages (
  id BIGSERIAL PRIMARY KEY,
  page_key VARCHAR(100) NOT NULL UNIQUE,
  status VARCHAR(30) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE static_page_translations (
  id BIGSERIAL PRIMARY KEY,
  static_page_id BIGINT NOT NULL REFERENCES static_pages(id) ON DELETE CASCADE,
  locale VARCHAR(20) NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  content TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  UNIQUE (static_page_id, locale),
  UNIQUE (locale, slug)
);

CREATE TABLE site_settings (
  id BIGSERIAL PRIMARY KEY,
  setting_key VARCHAR(120) NOT NULL UNIQUE,
  setting_value_json JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id BIGINT REFERENCES admin_users(id) ON DELETE SET NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id VARCHAR(100) NOT NULL,
  action VARCHAR(50) NOT NULL,
  before_json JSONB,
  after_json JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_source_channel ON leads(source_channel);
CREATE INDEX idx_leads_created_at ON leads(created_at);
CREATE INDEX idx_inquiries_inquiry_type ON inquiries(inquiry_type);
CREATE INDEX idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_posts_status ON posts(status);
