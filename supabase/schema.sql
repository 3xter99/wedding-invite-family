-- Выполните этот SQL в Supabase: SQL Editor → New query → Run

create table if not exists rsvp_responses (
  id bigint generated always as identity primary key,
  full_name text not null,
  attendance text not null,
  drinks text[] not null default '{}',
  source_site text not null default 'unknown',
  submitted_at timestamptz not null default now()
);

-- Если таблица уже была создана без source_site:
alter table rsvp_responses
  add column if not exists source_site text not null default 'unknown';

alter table rsvp_responses enable row level security;

-- Гости могут только отправлять ответы (не читать чужие)
create policy "Anyone can submit RSVP"
  on rsvp_responses
  for insert
  to anon, authenticated
  with check (true);
