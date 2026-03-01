-- ============================================================
-- PackMyCake — Full Database Schema
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================

set search_path to "fs_a0c74478-27e0-49a7-80e6-af701b542a05_agent_1";

-- 1. CATEGORIES
create table if not exists categories (
  id          serial primary key,
  name        text not null,
  description text,
  image_url   text,
  status      text default 'active',
  created_at  timestamptz default now()
);

-- 2. PRODUCTS
create table if not exists products (
  id                   serial primary key,
  name                 text not null,
  description          text,
  price                numeric(10,2) not null default 0,
  sale_price           numeric(10,2),
  sku                  text,
  stock                integer not null default 0,
  low_stock_threshold  integer not null default 10,
  category_id          integer references categories(id) on delete set null,
  primary_image_url    text,
  custom_printing      boolean default false,
  created_at           timestamptz default now()
);

-- 3. PRODUCT VARIANTS
create table if not exists product_variants (
  id         serial primary key,
  product_id integer references products(id) on delete cascade,
  size       text,
  color      text,
  price      numeric(10,2),
  stock      integer default 0,
  created_at timestamptz default now()
);

-- 4. PRODUCT IMAGES
create table if not exists product_images (
  id         serial primary key,
  product_id integer references products(id) on delete cascade,
  image_url  text not null,
  sort_order integer default 0,
  created_at timestamptz default now()
);

-- 5. BULK PRICING TIERS
create table if not exists bulk_pricing (
  id             serial primary key,
  product_id     integer references products(id) on delete cascade,
  min_qty        integer not null,
  max_qty        integer,
  price_per_unit numeric(10,2) not null,
  created_at     timestamptz default now()
);

-- 6. CUSTOMERS
create table if not exists customers (
  id          serial primary key,
  name        text,
  email       text unique,
  phone       text,
  company     text,
  total_spend numeric(10,2) default 0,
  created_at  timestamptz default now()
);

-- 7. ORDERS
create table if not exists orders (
  id             serial primary key,
  customer_name  text,
  customer_email text,
  status         text not null default 'pending',
  subtotal       numeric(10,2) default 0,
  discount       numeric(10,2) default 0,
  tax            numeric(10,2) default 0,
  shipping       numeric(10,2) default 0,
  total          numeric(10,2) default 0,
  payment_method text,
  created_at     timestamptz default now()
);

-- 8. ORDER ITEMS
create table if not exists order_items (
  id         serial primary key,
  order_id   integer references orders(id) on delete cascade,
  product_id integer references products(id) on delete set null,
  variant_id integer references product_variants(id) on delete set null,
  quantity   integer not null,
  price      numeric(10,2) not null,
  created_at timestamptz default now()
);

-- 9. ORDER ADDRESSES
create table if not exists order_addresses (
  id           serial primary key,
  order_id     integer references orders(id) on delete cascade,
  name         text,
  email        text,
  phone        text,
  address_line text,
  city         text,
  state        text,
  postal_code  text,
  created_at   timestamptz default now()
);

-- 10. ORDER PAYMENTS
create table if not exists order_payments (
  id             serial primary key,
  order_id       integer references orders(id) on delete cascade,
  method         text,
  status         text default 'initiated',
  transaction_id text,
  created_at     timestamptz default now()
);

-- 11. COUPONS
create table if not exists coupons (
  id            serial primary key,
  code          text unique not null,
  discount_type text not null default 'percentage', -- 'percentage' or 'flat'
  value         numeric(10,2) not null,
  min_order     numeric(10,2) default 0,
  max_uses      integer,
  used_count    integer default 0,
  expires_at    timestamptz,
  active        boolean default true,
  created_at    timestamptz default now()
);

-- 12. REVIEWS
create table if not exists reviews (
  id            serial primary key,
  product_id    integer references products(id) on delete cascade,
  customer_name text,
  rating        integer check (rating between 1 and 5),
  comment       text,
  status        text default 'pending',  -- 'pending' | 'approved'
  created_at    timestamptz default now()
);

-- 13. WISHLIST ITEMS
create table if not exists wishlist_items (
  id             serial primary key,
  product_id     integer references products(id) on delete cascade,
  customer_email text not null,
  created_at     timestamptz default now(),
  unique(product_id, customer_email)
);

-- 14. BLOG POSTS
create table if not exists blog_posts (
  id              serial primary key,
  title           text not null,
  excerpt         text,
  content         text,
  author          text,
  cover_image_url text,
  published_at    timestamptz default now(),
  created_at      timestamptz default now()
);

-- 15. CMS CONTENT
create table if not exists cms_content (
  id        serial primary key,
  key       text unique not null,
  title     text,
  content   text,
  image_url text,
  created_at timestamptz default now()
);

-- 16. INQUIRIES (contact / bulk order forms)
create table if not exists inquiries (
  id         serial primary key,
  type       text,   -- 'contact' | 'bulk' | 'custom'
  status     text default 'new',
  name       text,
  email      text,
  company    text,
  message    text,
  created_at timestamptz default now()
);

-- 17. AUTH USERS (for login/account)
create table if not exists auth_users (
  id            serial primary key,
  email         text unique not null,
  password_hash text not null,
  role          text default 'customer',
  created_at    timestamptz default now()
);

-- 18. AUTH SESSIONS
create table if not exists auth_sessions (
  id         text primary key,
  user_id    integer references auth_users(id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz default now()
);

-- 19. COMPANY SETTINGS
create table if not exists company_settings (
  id           integer primary key default 1,
  company_name text,
  logo_url     text,
  plot_no      text,
  address_line text,
  country      text,
  state        text,
  city         text,
  locality     text,
  zip_code     text,
  phone        text,
  mobile       text,
  website      text,
  email        text,
  gst_number   text,
  pan_no       text,
  updated_at   timestamptz default now(),
  constraint single_row check (id = 1)
);

-- 20. EMPLOYEES
create table if not exists employees (
  id            serial primary key,
  employee_id   text unique,
  name          text not null,
  father_name   text,
  address       text,
  qualification text,
  email         text unique,
  gender        text,
  dob           date,
  mobile        text,
  designation   text,
  join_date     date default current_date,
  username      text unique,
  password_hash text,
  permissions   jsonb default '[]'::jsonb,
  status        text default 'active',
  created_at    timestamptz default now()
);

-- ============================================================
-- SEED DATA — starter content so the homepage isn't blank
-- ============================================================

-- Categories
insert into categories (name, description) values
  ('Cake Boxes',    'Individual and tiered cake packaging'),
  ('Cupcake Boxes', 'Single and multi-slot cupcake boxes'),
  ('Gift Packaging','Premium gift wrap and ribbon sets'),
  ('Custom Print',  'Fully customisable printed boxes')
on conflict do nothing;

-- Products (4 starter products)
insert into products (name, description, price, sale_price, sku, stock, low_stock_threshold, category_id, primary_image_url, custom_printing) values
  ('Classic White Cake Box',  'Sturdy matte-finish cake box in pristine white.',  149, 129, 'BOX-W-001', 500,  20, 1, 'https://images.unsplash.com/photo-1612887726773-e64ca27e3a5f?w=600', false),
  ('Kraft Brown Cake Box',    'Eco-friendly kraft board box with handle.',         179, null,'BOX-K-001', 300,  15, 1, 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600', false),
  ('6-Slot Cupcake Box',      'Window-front box holds 6 standard cupcakes.',       99, 89,  'CUP-6-001', 800,  30, 2, 'https://images.unsplash.com/photo-1519915028121-7d3463d5b1ff?w=600', false),
  ('Custom Printed Gift Box', 'Full-colour CMYK print on premium card. MOQ 50.',  399, null,'GFT-C-001', 200,  10, 4, 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=600', true)
on conflict do nothing;

-- Bulk pricing for product 1
insert into bulk_pricing (product_id, min_qty, max_qty, price_per_unit) values
  (1, 10,  49,  129),
  (1, 50,  199, 109),
  (1, 200, null, 89)
on conflict do nothing;

-- CMS content (homepage hero + banner)
insert into cms_content (key, title, content, image_url) values
  ('home_hero',   'Premium cake packaging, delivered fast',
   'From individual boxes to pallet-scale bulk orders — MOQ 10 units, pan-India shipping, GST-ready invoices.',
   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'),
  ('home_banner', 'Ready for your next bulk order?',
   'Get dedicated account management, monthly contracts, and tiered pricing when you order 200+ units.',
   'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800'),
  ('contact',     'Get in touch',
   'Our sales team is available Monday to Saturday, 9 AM to 6 PM IST. Reach us for quotes, samples, and custom orders.',
   null)
on conflict (key) do nothing;

-- One sample coupon
insert into coupons (code, discount_type, value, min_order, expires_at, active) values
  ('WELCOME10', 'percentage', 10, 500, now() + interval '1 year', true)
on conflict (code) do nothing;

-- One sample blog post
insert into blog_posts (title, excerpt, author, cover_image_url, published_at) values
  ('5 packaging trends bakeries love in 2026',
   'From window-front kraft boxes to foil-stamped wedding cake packaging — here''s what your customers are asking for.',
   'PackMyCake Team',
   'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
   now())
on conflict do nothing;

-- Demo auth user (password = password123, hashed for PBKDF2)
insert into auth_users (email, password_hash, role) values
  ('demo@packmycake.in', '5b9af3b5cf3807626a62ad13a5f606d7:a382b60a16f8325f87570f19fb1f80a026da2cfd135358ad243349aae9ff47fae3dba0a13c0e7397a1f7ac8d129340c1efc785ab53c65fb7f2236eeedb7919e8', 'admin'),
  ('admin@packmycake.com', '5c0d3c030b91af8ed88c6210f1856cc7:ac577e67ee49704d44cf914fbc302cb362741d7936e1fedc27dcb1af6591ceb140e8f6ceebf600d2f398787d957090d84f7e18a6ab96ddceedc39885c4f2924c', 'admin')
on conflict (email) do nothing;

-- Default Company Settings
insert into company_settings (id, company_name, logo_url, country, state, city, email, phone) values
  (1, 'Pack My Cake', null, 'India', 'Tamil Nadu', 'Chennai', 'contact@packmycake.in', '+91 9876543210')
on conflict (id) do nothing;

-- ============================================================
-- Row Level Security — disable for development, enable later
-- ============================================================
alter table products       disable row level security;
alter table categories     disable row level security;
alter table orders         disable row level security;
alter table order_items    disable row level security;
alter table customers      disable row level security;
alter table coupons        disable row level security;
alter table reviews        disable row level security;
alter table wishlist_items disable row level security;
alter table blog_posts     disable row level security;
alter table cms_content    disable row level security;
alter table inquiries      disable row level security;
alter table auth_users     disable row level security;
alter table auth_sessions  disable row level security;
alter table company_settings disable row level security;
alter table employees      disable row level security;
