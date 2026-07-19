-- Hekal store schema
-- Run this in the Supabase SQL Editor (Project > SQL Editor > New query)

create extension if not exists "uuid-ossp";

-- ── Products ────────────────────────────────────────────────────────────
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name_en text not null,
  name_ar text not null,
  description_en text,
  description_ar text,
  price_egp numeric(10,2) not null,
  compare_at_price_egp numeric(10,2),
  fabric_en text,           -- e.g. "Oxford cotton", "Poplin"
  fabric_ar text,
  image_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Sizes/colors per product, each with its own stock count
create table if not exists product_variants (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid not null references products(id) on delete cascade,
  size text not null,        -- S, M, L, XL, XXL
  color_en text not null,
  color_ar text not null,
  stock integer not null default 0,
  unique (product_id, size, color_en)
);

-- ── Orders ──────────────────────────────────────────────────────────────
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  customer_name text not null,
  phone text not null,
  email text,
  address text not null,
  city text not null,
  governorate text not null,
  payment_method text not null default 'cod', -- 'cod' for now; add gateways later
  subtotal_egp numeric(10,2) not null,
  status text not null default 'pending', -- pending, confirmed, shipped, delivered, cancelled
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id),
  variant_id uuid not null references product_variants(id),
  name_en text not null,
  name_ar text not null,
  size text not null,
  color_en text not null,
  color_ar text not null,
  unit_price_egp numeric(10,2) not null,
  quantity integer not null
);

-- ── Row Level Security ────────────────────────────────────────────────
alter table products enable row level security;
alter table product_variants enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;

-- Anyone (anon) can read active products and their variants — needed for the storefront
create policy "public read active products" on products
  for select using (is_active = true);

create policy "public read variants" on product_variants
  for select using (true);

-- Orders/order_items are written only via the server route using the
-- service role key, which bypasses RLS — so no insert policy for anon here.
-- This keeps stock decrement + order creation atomic and prevents price
-- tampering from the browser.

-- ── Atomic order creation ───────────────────────────────────────────────
-- Takes the real price/stock from the products/product_variants tables
-- (never trusts numbers sent from the browser), decrements stock, and
-- writes the order + line items in a single transaction. Raises an
-- exception (which the API route turns into a 400) if any variant is out
-- of stock, so partial orders can't be created.
create or replace function create_order(
  p_customer_name text,
  p_phone text,
  p_email text,
  p_address text,
  p_city text,
  p_governorate text,
  p_items jsonb
) returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_subtotal numeric(10,2) := 0;
  v_item jsonb;
  v_variant product_variants%rowtype;
  v_product products%rowtype;
  v_quantity integer;
begin
  insert into orders (customer_name, phone, email, address, city, governorate, subtotal_egp)
  values (p_customer_name, p_phone, p_email, p_address, p_city, p_governorate, 0)
  returning id into v_order_id;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_quantity := (v_item->>'quantity')::integer;

    select * into v_variant from product_variants where id = (v_item->>'variant_id')::uuid for update;
    if not found then
      raise exception 'Variant % not found', v_item->>'variant_id';
    end if;

    if v_variant.stock < v_quantity then
      raise exception 'Insufficient stock for variant %', v_variant.id;
    end if;

    select * into v_product from products where id = v_variant.product_id;

    insert into order_items (
      order_id, product_id, variant_id, name_en, name_ar, size, color_en, color_ar,
      unit_price_egp, quantity
    ) values (
      v_order_id, v_product.id, v_variant.id, v_product.name_en, v_product.name_ar,
      v_variant.size, v_variant.color_en, v_variant.color_ar, v_product.price_egp, v_quantity
    );

    update product_variants set stock = stock - v_quantity where id = v_variant.id;

    v_subtotal := v_subtotal + (v_product.price_egp * v_quantity);
  end loop;

  update orders set subtotal_egp = v_subtotal where id = v_order_id;

  return v_order_id;
end;
$$;
