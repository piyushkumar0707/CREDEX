create extension if not exists pgcrypto;

create table if not exists public.audits (
  id uuid primary key,
  team_size integer not null check (team_size > 0),
  use_case text not null check (use_case in ('coding', 'writing', 'data', 'research', 'mixed')),
  total_monthly_spend numeric not null check (total_monthly_spend >= 0),
  total_monthly_savings numeric not null check (total_monthly_savings >= 0),
  total_annual_savings numeric not null check (total_annual_savings >= 0),
  result jsonb not null,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.audits(id) on delete set null,
  email text not null,
  company_name text,
  role text,
  team_size integer check (team_size is null or team_size > 0),
  created_at timestamptz not null default now()
);

create index if not exists audits_created_at_idx on public.audits(created_at desc);
create index if not exists leads_audit_id_idx on public.leads(audit_id);
create index if not exists leads_created_at_idx on public.leads(created_at desc);

alter table public.audits enable row level security;
alter table public.leads enable row level security;

-- The app writes through SUPABASE_SERVICE_ROLE_KEY from server routes.
-- No anonymous client policies are required for this MVP.
