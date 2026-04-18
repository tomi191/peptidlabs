-- Migration: 004_reviews.sql
-- Customer reviews system.
-- Public reads only approved reviews; only service-role can insert/update/delete.
-- Run via Supabase SQL Editor.

-- ==================== ENUM ====================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'review_status') then
    create type review_status as enum ('pending', 'approved', 'rejected');
  end if;
end$$;

-- ==================== TABLE ====================

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  title text,
  text text not null,
  author_name text not null,
  author_email text not null,
  verified_purchase boolean not null default false,
  order_id uuid references orders(id) on delete set null,
  status review_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ==================== INDEX ====================

create index if not exists reviews_product_status_created_idx
  on reviews (product_id, status, created_at desc);

-- ==================== TRIGGER: updated_at ====================

create or replace function set_updated_at_reviews()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_reviews_updated_at on reviews;
create trigger trg_reviews_updated_at
  before update on reviews
  for each row
  execute function set_updated_at_reviews();

-- ==================== ROW LEVEL SECURITY ====================

alter table reviews enable row level security;

-- Public SELECT: only approved reviews
drop policy if exists "reviews_public_select_approved" on reviews;
create policy "reviews_public_select_approved"
  on reviews
  for select
  using (status = 'approved');

-- Service role bypasses RLS automatically (no INSERT/UPDATE/DELETE policies for
-- anon or authenticated). All writes must go through service-role key.
