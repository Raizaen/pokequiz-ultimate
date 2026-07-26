alter table public.questions
add column if not exists validation_status text not null default 'review'
check (validation_status in ('review', 'validated', 'contested'));

update public.questions
set validation_status = case
  when payload #>> '{validation,status}' = 'validated'
    and jsonb_typeof(payload #> '{validation,sources}') = 'array'
    and jsonb_array_length(payload #> '{validation,sources}') > 0
  then 'validated'
  else 'review'
end;

create or replace function public.question_has_sources(question_payload jsonb)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select case
    when jsonb_typeof(question_payload #> '{validation,sources}') = 'array'
    then jsonb_array_length(question_payload #> '{validation,sources}') > 0
    else false
  end;
$$;

create or replace function public.enforce_question_publication()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.publication_status = 'published'
    and (
      new.validation_status <> 'validated'
      or not public.question_has_sources(new.payload)
    )
  then
    raise exception 'A published question must be validated and contain at least one source.';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_question_publication_trigger on public.questions;
create trigger enforce_question_publication_trigger
before insert or update on public.questions
for each row execute function public.enforce_question_publication();

create table if not exists public.question_revisions (
  revision_id bigint generated always as identity primary key,
  question_id text not null,
  payload jsonb not null,
  publication_status text not null,
  validation_status text not null,
  operation text not null check (operation in ('update', 'delete')),
  changed_at timestamptz not null default now(),
  changed_by uuid references auth.users(id)
);

alter table public.question_revisions enable row level security;

create policy "Administrators can read question history"
on public.question_revisions
for select
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  )
);

create or replace function public.archive_question_revision()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.question_revisions (
    question_id,
    payload,
    publication_status,
    validation_status,
    operation,
    changed_by
  )
  values (
    old.id,
    old.payload,
    old.publication_status,
    old.validation_status,
    case when tg_op = 'DELETE' then 'delete' else 'update' end,
    auth.uid()
  );
  return old;
end;
$$;

drop trigger if exists archive_question_revision_trigger on public.questions;
create trigger archive_question_revision_trigger
after update or delete on public.questions
for each row execute function public.archive_question_revision();

create or replace function public.restore_question_revision(target_revision_id bigint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_revision public.question_revisions%rowtype;
  restored_publication_status text;
begin
  if not exists (
    select 1 from public.admin_users
    where admin_users.user_id = auth.uid()
  ) then
    raise exception 'Administrator access required.';
  end if;

  select *
  into selected_revision
  from public.question_revisions
  where revision_id = target_revision_id;

  if selected_revision.revision_id is null then
    raise exception 'Revision not found.';
  end if;

  restored_publication_status := case
    when selected_revision.publication_status = 'published'
      and selected_revision.validation_status = 'validated'
      and public.question_has_sources(selected_revision.payload)
    then 'published'
    else 'draft'
  end;

  insert into public.questions (
    id,
    payload,
    publication_status,
    validation_status,
    created_by,
    updated_by,
    updated_at
  )
  values (
    selected_revision.question_id,
    selected_revision.payload,
    restored_publication_status,
    selected_revision.validation_status,
    auth.uid(),
    auth.uid(),
    now()
  )
  on conflict (id) do update set
    payload = excluded.payload,
    publication_status = excluded.publication_status,
    validation_status = excluded.validation_status,
    updated_by = auth.uid(),
    updated_at = now();
end;
$$;

revoke all on function public.restore_question_revision(bigint) from public;
grant execute on function public.restore_question_revision(bigint) to authenticated;
