create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Administrators can read their own membership"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

create table if not exists public.questions (
  id text primary key,
  payload jsonb not null,
  publication_status text not null default 'draft'
    check (publication_status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id),
  updated_by uuid references auth.users(id)
);

alter table public.questions enable row level security;

create policy "Everyone can read published questions"
on public.questions
for select
to anon, authenticated
using (
  publication_status = 'published'
  or exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create policy "Administrators can insert questions"
on public.questions
for insert
to authenticated
with check (
  exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);

create policy "Administrators can update questions"
on public.questions
for update
to authenticated
using (
  exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
)
with check (
  exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);

create policy "Administrators can delete questions"
on public.questions
for delete
to authenticated
using (
  exists (select 1 from public.admin_users where admin_users.user_id = auth.uid())
);
