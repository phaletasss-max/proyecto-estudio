begin;

create table if not exists public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  resource_id text not null references public.study_resources(id) on delete cascade,
  started_at timestamptz not null,
  ended_at timestamptz not null,
  duration_minutes smallint not null check (duration_minutes between 1 and 240),
  outcome text not null check (length(outcome) between 10 and 1000),
  next_action text not null default '' check (length(next_action) <= 500),
  created_at timestamptz not null default now(),
  check (ended_at >= started_at)
);

create index if not exists study_sessions_user_recent_idx
  on public.study_sessions (user_id, created_at desc);
create index if not exists study_sessions_resource_idx
  on public.study_sessions (resource_id);

alter table public.study_sessions enable row level security;
revoke all on public.study_sessions from anon, authenticated;
grant select, insert on public.study_sessions to authenticated;

drop policy if exists "Study sessions own read" on public.study_sessions;
create policy "Study sessions own read" on public.study_sessions for select to authenticated
using (user_id = auth.uid() and public.has_member_access());

drop policy if exists "Study sessions own insert" on public.study_sessions;
create policy "Study sessions own insert" on public.study_sessions for insert to authenticated
with check (
  user_id = auth.uid()
  and public.has_member_access()
  and exists (
    select 1 from public.study_resources resource
    where resource.id = resource_id and resource.is_published
  )
);

commit;
