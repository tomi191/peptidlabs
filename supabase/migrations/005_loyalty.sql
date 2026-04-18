-- Migration: 005_loyalty.sql
-- Email-based loyalty rewards. No auth table — email is the identity.
-- 1 point per €1 spent. Tiers: bronze (<50 pts), silver (50-199), gold (>=200).
-- Run via Supabase SQL Editor.

-- ==================== ENUM ====================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'reward_tier') then
    create type reward_tier as enum ('bronze', 'silver', 'gold');
  end if;
end$$;

-- ==================== TABLE ====================

create table if not exists user_rewards (
  email text primary key,
  points int not null default 0 check (points >= 0),
  total_spent numeric(10, 2) not null default 0 check (total_spent >= 0),
  tier reward_tier not null default 'bronze',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_rewards_points_idx
  on user_rewards (points desc);

-- ==================== TRIGGER: updated_at + tier ====================

create or replace function set_user_rewards_meta()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  -- Auto-compute tier from points
  new.tier = case
    when new.points >= 200 then 'gold'::reward_tier
    when new.points >= 50 then 'silver'::reward_tier
    else 'bronze'::reward_tier
  end;
  return new;
end;
$$;

drop trigger if exists trg_user_rewards_meta on user_rewards;
create trigger trg_user_rewards_meta
  before insert or update on user_rewards
  for each row
  execute function set_user_rewards_meta();

-- ==================== FUNCTION: award points on confirmed order ====================
-- Call this from the Stripe webhook (or manually when marking COD confirmed).
-- Idempotent via orders.rewards_awarded boolean flag.

alter table orders add column if not exists rewards_awarded boolean not null default false;

create or replace function award_order_rewards(p_order_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_email text;
  v_total numeric(10, 2);
  v_awarded boolean;
  v_points_to_add int;
begin
  select email, total, rewards_awarded
    into v_email, v_total, v_awarded
    from orders
    where id = p_order_id;

  if v_email is null or v_awarded = true or v_total is null or v_total <= 0 then
    return;
  end if;

  -- 1 point per €1 spent, rounded down
  v_points_to_add := floor(v_total)::int;

  insert into user_rewards (email, points, total_spent)
  values (lower(trim(v_email)), v_points_to_add, v_total)
  on conflict (email) do update set
    points = user_rewards.points + excluded.points,
    total_spent = user_rewards.total_spent + excluded.total_spent;

  update orders set rewards_awarded = true where id = p_order_id;
end;
$$;

-- ==================== ROW LEVEL SECURITY ====================

alter table user_rewards enable row level security;

-- No public policies: all reads go through service-role (via /api/account with
-- a signed magic-link token). Service role bypasses RLS automatically.
