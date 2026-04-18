-- 006_stock_and_payments.sql
-- Adds atomic stock decrement, Stripe idempotency, and order state machine.

-- 1. Stripe session ID on orders (for idempotency + reconciliation)
alter table orders
  add column if not exists stripe_session_id text,
  add column if not exists stripe_payment_intent_id text,
  add column if not exists paid_at timestamptz,
  add column if not exists cancelled_at timestamptz,
  add column if not exists cancellation_reason text;

create unique index if not exists orders_stripe_session_idx
  on orders (stripe_session_id) where stripe_session_id is not null;

-- 2. Atomic stock decrement — prevents over-selling under concurrency.
-- Returns { ok: bool, reason: text, stock: int } per input row.
create or replace function decrement_product_stock(
  p_product_id uuid,
  p_quantity int
) returns table (ok boolean, reason text, new_stock int)
language plpgsql
security definer
as $$
declare
  v_stock int;
begin
  -- Lock the row to serialize concurrent decrements.
  select stock into v_stock
    from products
    where id = p_product_id
    for update;

  if v_stock is null then
    return query select false, 'PRODUCT_NOT_FOUND'::text, 0;
    return;
  end if;

  if v_stock < p_quantity then
    return query select false, 'INSUFFICIENT_STOCK'::text, v_stock;
    return;
  end if;

  update products
    set stock = stock - p_quantity,
        updated_at = now()
    where id = p_product_id;

  return query select true, 'OK'::text, v_stock - p_quantity;
end;
$$;

-- 3. Helper to restore stock on cancellation
create or replace function restore_product_stock(
  p_product_id uuid,
  p_quantity int
) returns void
language plpgsql
security definer
as $$
begin
  update products
    set stock = stock + p_quantity,
        updated_at = now()
    where id = p_product_id;
end;
$$;

-- 4. Audit log for admin actions (who changed what when)
create table if not exists admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor text not null,              -- 'admin' for now; could be user_id later
  action text not null,              -- e.g. 'order.status_change', 'product.update'
  entity_type text not null,         -- 'order' | 'product' | ...
  entity_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists admin_audit_log_entity_idx
  on admin_audit_log (entity_type, entity_id, created_at desc);
create index if not exists admin_audit_log_created_idx
  on admin_audit_log (created_at desc);

-- RLS: only service-role can read/write
alter table admin_audit_log enable row level security;
