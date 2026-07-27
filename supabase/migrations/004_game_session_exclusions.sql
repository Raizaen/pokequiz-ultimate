alter table public.game_sessions
add column if not exists excluded_at timestamptz,
add column if not exists excluded_by uuid references auth.users(id);

create or replace function public.set_game_session_excluded(
  target_session_id uuid,
  should_exclude boolean
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

  update public.game_sessions
  set
    excluded_at = case when should_exclude then now() else null end,
    excluded_by = case when should_exclude then auth.uid() else null end
  where session_id = target_session_id;

  if not found then
    raise exception 'Game session not found.';
  end if;
end;
$$;

revoke all on function public.set_game_session_excluded(uuid, boolean) from public;
grant execute on function public.set_game_session_excluded(uuid, boolean) to authenticated;
