create extension if not exists pgcrypto;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  guest_name text not null,
  guest_email text not null,
  guest_phone text,
  check_in date not null,
  check_out date not null,
  guests integer not null check (guests > 0),
  total_price numeric not null default 0,
  agreed_price numeric not null default 0,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  deposit_amount numeric default 100,
  deposit_status text default 'pending' check (deposit_status in ('pending', 'submitted', 'paid')),
  deposit_paid_at timestamptz,
  contract_accepted_at timestamptz,
  contract_acceptance_name text,
  contract_acceptance_dni text,
  contract_signature text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid,
  sender_type text not null check (sender_type in ('guest', 'admin')),
  sender_name text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.pricing (
  id uuid primary key default gen_random_uuid(),
  season text not null check (season in ('low', 'mid', 'high')),
  price_per_night numeric not null default 0,
  start_date date,
  end_date date,
  created_at timestamptz not null default now()
);

create index if not exists reservations_status_idx on public.reservations(status);
create index if not exists reservations_check_in_idx on public.reservations(check_in);
create index if not exists chat_messages_reservation_id_idx on public.chat_messages(reservation_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at);

alter table public.reservations enable row level security;
alter table public.chat_messages enable row level security;
alter table public.pricing enable row level security;

-- The app writes through server actions using SUPABASE_SECRET_KEY.
-- Browser clients do not need direct table permissions for persistence.
-- Optional public read access for pricing only.
drop policy if exists "Public can read pricing" on public.pricing;
create policy "Public can read pricing"
  on public.pricing for select
  to anon
  using (true);

-- Enable Realtime if the table is not already in the publication.
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'chat_messages'
  ) then
    alter publication supabase_realtime add table public.chat_messages;
  end if;
end $$;
