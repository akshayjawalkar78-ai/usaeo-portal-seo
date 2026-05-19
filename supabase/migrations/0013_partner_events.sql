create table if not exists partner_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null check (event_type in ('competition', 'program', 'workshop')),
  status text not null default 'upcoming' check (status in ('upcoming', 'past')),
  partner text,
  partner_short text,
  partner_logo text,
  partner_url text,
  title text not null,
  date text,
  iso_date text,
  category text,
  badge text,
  description text,
  external_url text,
  highlights jsonb default '[]'::jsonb,
  co_partner text,
  co_partner_logo text,
  co_partner_url text,
  time text,
  instructor text,
  role text,
  topic text,
  zoom_url text,
  open_to text,
  free boolean default false,
  created_at timestamptz not null default now()
);

alter table partner_events enable row level security;
create policy "allow all" on partner_events for all using (true);
