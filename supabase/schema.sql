-- ═══════════════════════════════════════════════════════════════════════════
--  Database schema for the Roundup app.
--
--  How to run: in your Supabase project, open "SQL Editor", paste this whole
--  file and click "Run". That's it — tables, policies and the photo storage
--  bucket are all created for you.
-- ═══════════════════════════════════════════════════════════════════════════

-- ── Tables ──────────────────────────────────────────────────────────────────

create table if not exists events (
  id             text primary key,
  organiser_id   text,
  organiser_name text not null,
  title          text not null,
  date           text not null,
  description    text,
  attendees      jsonb not null default '[]'::jsonb,
  rating         numeric not null default 0,
  created_at     timestamptz not null default now()
);

create table if not exists fines (
  id          text primary key,
  member_id   text,
  member_name text not null,
  amount      numeric not null,
  reason      text,
  date        text,
  paid        boolean not null default false,
  created_at  timestamptz not null default now()
);

create table if not exists proposals (
  id             text primary key,
  organiser_id   text,
  organiser_name text not null,
  title          text not null,
  location       text,
  status         text not null default 'voting', -- voting | confirmed | cancelled
  created_at     timestamptz not null default now()
);

create table if not exists date_options (
  id          text primary key,
  proposal_id text not null references proposals (id) on delete cascade,
  date        text not null,
  "time"      text not null,
  created_at  timestamptz not null default now()
);

create table if not exists votes (
  id             bigint generated always as identity primary key,
  proposal_id    text not null,
  date_option_id text not null,
  member_name    text not null,
  created_at     timestamptz not null default now(),
  unique (date_option_id, member_name)
);

-- Also stores a few app-level key/value entries (banner image, overrides)
-- under reserved "__app_*__" names.
create table if not exists member_profiles (
  name       text primary key,
  avatar_url text
);

-- ── Row Level Security ──────────────────────────────────────────────────────
-- The browser only ever READS data (with the anon key). All writes go through
-- server actions using the service-role key, which bypasses RLS.

alter table events          enable row level security;
alter table fines           enable row level security;
alter table proposals       enable row level security;
alter table date_options    enable row level security;
alter table votes           enable row level security;
alter table member_profiles enable row level security;

create policy "public read events"          on events          for select using (true);
create policy "public read fines"           on fines           for select using (true);
create policy "public read proposals"       on proposals       for select using (true);
create policy "public read date_options"    on date_options    for select using (true);
create policy "public read votes"           on votes           for select using (true);
create policy "public read member_profiles" on member_profiles for select using (true);

-- ── Storage bucket for avatars & event photo galleries ─────────────────────

insert into storage.buckets (id, name, public)
values ('Photos', 'Photos', true)
on conflict (id) do nothing;
