-- AI Usage Logs — cost tracking for blog-writer (and any future AI calls).
-- Adapted from the imported blog-writer-export kit.

create table if not exists ai_usage_logs (
  id uuid primary key default gen_random_uuid(),
  feature text not null,                         -- "blog-generation" | "image-gen" | "translate" | ...
  model text not null,                           -- e.g. "anthropic/claude-3.5-sonnet"
  prompt_tokens integer not null default 0,
  completion_tokens integer not null default 0,
  cost_usd numeric(10, 6) not null default 0,
  metadata jsonb,                                -- post id, user, etc.
  created_at timestamptz not null default now()
);

create index if not exists idx_ai_usage_logs_created on ai_usage_logs (created_at desc);
create index if not exists idx_ai_usage_logs_feature on ai_usage_logs (feature, created_at desc);
create index if not exists idx_ai_usage_logs_model on ai_usage_logs (model, created_at desc);

-- Daily rollup view — quick "how much did we spend last week"
create or replace view ai_usage_daily as
select
  date(created_at) as day,
  feature,
  model,
  count(*) as request_count,
  sum(prompt_tokens) as total_prompt_tokens,
  sum(completion_tokens) as total_completion_tokens,
  sum(cost_usd) as total_cost_usd
from ai_usage_logs
group by date(created_at), feature, model
order by day desc, total_cost_usd desc;

-- RLS — only authenticated (admin) access. The service role key bypasses RLS,
-- which is what blog-writer uses server-side, so this policy is for completeness.
alter table ai_usage_logs enable row level security;

drop policy if exists "Authenticated can manage AI usage logs" on ai_usage_logs;
create policy "Authenticated can manage AI usage logs"
  on ai_usage_logs
  for all
  to authenticated
  using (true)
  with check (true);
