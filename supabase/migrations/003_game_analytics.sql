create table if not exists public.game_sessions (
  session_id uuid primary key,
  started_at timestamptz not null,
  finished_at timestamptz not null,
  duration_seconds integer not null check (duration_seconds between 0 and 86400),
  mode text not null check (mode in ('mixed', 'category')),
  category text,
  difficulty text not null check (difficulty in ('discovery', 'confirmed', 'expert', 'all')),
  timer_seconds integer check (timer_seconds in (10, 15, 20, 30)),
  question_count integer not null check (question_count between 1 and 100),
  player_count integer not null check (player_count between 1 and 8),
  players jsonb not null check (jsonb_typeof(players) = 'array'),
  question_results jsonb not null check (jsonb_typeof(question_results) = 'array'),
  image_failures jsonb not null default '[]'::jsonb check (jsonb_typeof(image_failures) = 'array'),
  created_at timestamptz not null default now(),
  check (finished_at >= started_at),
  check (jsonb_array_length(players) = player_count),
  check (jsonb_array_length(question_results) = question_count)
);

create index if not exists game_sessions_finished_at_idx
on public.game_sessions (finished_at desc);

alter table public.game_sessions enable row level security;

drop policy if exists "Players can record completed games" on public.game_sessions;
create policy "Players can record completed games"
on public.game_sessions
for insert
to anon, authenticated
with check (
  jsonb_array_length(players) between 1 and 8
  and jsonb_array_length(question_results) between 1 and 100
  and jsonb_array_length(image_failures) <= 100
);

drop policy if exists "Administrators can read game analytics" on public.game_sessions;
create policy "Administrators can read game analytics"
on public.game_sessions
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

revoke all on table public.game_sessions from anon, authenticated;
grant insert on table public.game_sessions to anon, authenticated;
grant select on table public.game_sessions to authenticated;
