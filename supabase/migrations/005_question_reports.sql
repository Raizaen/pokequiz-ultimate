create table if not exists public.question_reports (
  report_id bigint generated always as identity primary key,
  session_id uuid,
  question_id text not null,
  question_prompt text not null,
  category text not null,
  reason text not null check (reason in ('incorrect', 'ambiguous', 'media', 'translation', 'other')),
  details text not null default '',
  reporter_names text not null default '',
  status text not null default 'open' check (status in ('open', 'resolved')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  resolved_by uuid references auth.users(id),
  check (char_length(question_id) between 1 and 200),
  check (char_length(question_prompt) between 1 and 1000),
  check (char_length(details) <= 2000)
);

create index if not exists question_reports_status_created_idx
on public.question_reports (status, created_at desc);

alter table public.question_reports enable row level security;

drop policy if exists "Players can report questions" on public.question_reports;
create policy "Players can report questions"
on public.question_reports
for insert
to anon, authenticated
with check (status = 'open' and resolved_at is null and resolved_by is null);

drop policy if exists "Administrators can read reports" on public.question_reports;
create policy "Administrators can read reports"
on public.question_reports
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create or replace function public.resolve_question_report(
  target_report_id bigint,
  should_resolve boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ) then
    raise exception 'Administrator access required.';
  end if;

  update public.question_reports
  set
    status = case when should_resolve then 'resolved' else 'open' end,
    resolved_at = case when should_resolve then now() else null end,
    resolved_by = case when should_resolve then auth.uid() else null end
  where report_id = target_report_id;

  if not found then
    raise exception 'Question report not found.';
  end if;
end;
$$;

revoke all on table public.question_reports from anon, authenticated;
grant insert on table public.question_reports to anon, authenticated;
grant select on table public.question_reports to authenticated;
revoke all on function public.resolve_question_report(bigint, boolean) from public;
grant execute on function public.resolve_question_report(bigint, boolean) to authenticated;
