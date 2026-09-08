-- ShadowBytes: secure flags, scores and CTF-based membership admission.
-- Apply this file once in Supabase SQL Editor. It preserves existing labs and users.
-- Never expose the service-role key in the frontend.

begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type t
    join pg_namespace n on n.oid = t.typnamespace
    where n.nspname = 'public' and t.typname = 'membership_status'
  ) then
    create type public.membership_status as enum ('applicant', 'member', 'admin', 'suspended');
  end if;
end;
$$;

alter table public.profiles
  add column if not exists access_status public.membership_status not null default 'applicant';

alter table public.labs
  add column if not exists points integer not null default 100,
  add column if not exists is_admission_challenge boolean not null default false,
  add column if not exists is_members_only boolean not null default false,
  add column if not exists framework text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists target_ip inet,
  add column if not exists estimated_minutes integer;

alter table public.labs
  drop constraint if exists labs_points_check;
alter table public.labs
  add constraint labs_points_check check (points > 0 and points <= 10000);

-- Sensitive data is deliberately kept in a table with no client SELECT policy.
-- This migration copies legacy values before removing them from the public table.
create table if not exists public.challenge_secrets (
  lab_id uuid primary key references public.labs(id) on delete cascade,
  flag_hash text not null check (flag_hash ~ '^[0-9a-f]{64}$'),
  writeup_markdown text not null default '',
  created_at timestamptz not null default now()
);

do $$
declare
  v_has_writeup boolean;
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'labs' and column_name = 'flag_hash'
  ) then
    select exists (
      select 1 from information_schema.columns
      where table_schema = 'public' and table_name = 'labs' and column_name = 'writeup_markdown'
    ) into v_has_writeup;

    if v_has_writeup then
      execute $copy$
      insert into public.challenge_secrets (lab_id, flag_hash, writeup_markdown)
      select
        id,
        case
          when flag_hash ~ '^[0-9a-f]{64}$' then flag_hash
          else encode(
            digest(
              case
                when lower(btrim(flag_hash)) ~ '^htb\{.*\}$'
                  then substring(lower(btrim(flag_hash)) from '^htb\{(.*)\}$')
                else lower(btrim(flag_hash))
              end,
              'sha256'
            ),
            'hex'
          )
        end,
        coalesce(writeup_markdown, '')
      from public.labs
      on conflict (lab_id) do update
        set flag_hash = excluded.flag_hash,
            writeup_markdown = excluded.writeup_markdown
      $copy$;
    else
      execute $copy$
        insert into public.challenge_secrets (lab_id, flag_hash)
        select
          id,
          case
            when flag_hash ~ '^[0-9a-f]{64}$' then flag_hash
            else encode(digest(lower(btrim(flag_hash)), 'sha256'), 'hex')
          end
        from public.labs
        on conflict (lab_id) do update set flag_hash = excluded.flag_hash
      $copy$;
    end if;

    alter table public.labs drop column flag_hash;
    alter table public.labs drop column if exists writeup_markdown;
  end if;
end;
$$;

create or replace function public.rank_for_points(p_points integer)
returns text
language sql
immutable
set search_path = public
as $$
  select case
    when p_points >= 5000 then 'Shadow Master'
    when p_points >= 3000 then 'Root Operator'
    when p_points >= 1500 then 'Cyber Specialist'
    when p_points >= 500 then 'Byte Hunter'
    else 'Script Kiddie'
  end;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and access_status = 'admin'
  );
$$;

create or replace function public.has_member_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and access_status in ('member', 'admin')
  );
$$;

-- Keep legacy profile creation, but make every new account an applicant until it
-- solves an admission CTF. Existing founders can be promoted with the UPDATE below.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_base_username text;
  v_username text;
begin
  v_base_username := regexp_replace(
    lower(coalesce(
      nullif(btrim(new.raw_user_meta_data->>'username'), ''),
      nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
      'estudiante'
    )),
    '[^a-z0-9_]+', '', 'g'
  );
  v_base_username := left(coalesce(nullif(v_base_username, ''), 'estudiante'), 28);
  v_username := v_base_username;

  begin
    insert into public.profiles (id, username, full_name, avatar_url, access_status)
    values (
      new.id,
      v_username,
      coalesce(nullif(btrim(new.raw_user_meta_data->>'full_name'), ''), 'Estudiante ShadowBytes'),
      coalesce(nullif(btrim(new.raw_user_meta_data->>'avatar_url'), ''), ''),
      'applicant'
    ) on conflict (id) do nothing;
  exception when unique_violation then
    v_username := left(v_base_username, 19) || '_' || left(replace(new.id::text, '-', ''), 8);
    insert into public.profiles (id, username, full_name, avatar_url, access_status)
    values (
      new.id,
      v_username,
      coalesce(nullif(btrim(new.raw_user_meta_data->>'full_name'), ''), 'Estudiante ShadowBytes'),
      coalesce(nullif(btrim(new.raw_user_meta_data->>'avatar_url'), ''), ''),
      'applicant'
    ) on conflict (id) do nothing;
  end;
  return new;
end;
$$;

-- Secure access rules. Do not reintroduce a policy that lets clients write points,
-- solves, badges or flags directly; those actions belong to the RPCs below.
alter table public.profiles enable row level security;
alter table public.labs enable row level security;
alter table public.challenge_secrets enable row level security;
alter table public.user_solves enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can update own safe profile fields" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);
create policy "Users can update own safe profile fields"
  on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Published labs are viewable by everyone" on public.labs;
drop policy if exists "Users can insert labs for review" on public.labs;
drop policy if exists "Published admission and member labs are readable" on public.labs;
create policy "Published admission and member labs are readable"
  on public.labs for select using (
    is_published
    and (
      is_admission_challenge
      or not is_members_only
      or public.has_member_access()
    )
  );

drop policy if exists "Solves are viewable by everyone" on public.user_solves;
drop policy if exists "Users can record own solves" on public.user_solves;
drop policy if exists "Users can view their own solves" on public.user_solves;
create policy "Users can view their own solves"
  on public.user_solves for select using (auth.uid() = user_id);

drop policy if exists "Badges are viewable by everyone" on public.badges;
drop policy if exists "User badges are viewable by everyone" on public.user_badges;
drop policy if exists "Users can insert own badges" on public.user_badges;
drop policy if exists "Users can view their own badges" on public.user_badges;
create policy "Badges are viewable by everyone"
  on public.badges for select using (true);
create policy "Users can view their own badges"
  on public.user_badges for select using (auth.uid() = user_id);

revoke all on public.challenge_secrets from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.user_solves from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.user_badges from anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on public.labs from anon, authenticated;
revoke update on public.profiles from authenticated;
grant update (full_name, avatar_url, bio, specialty, github_url, discord_tag, linkedin_url)
  on public.profiles to authenticated;

create or replace function public.submit_flag(p_lab_id uuid, p_flag text)
returns table (
  accepted boolean,
  already_solved boolean,
  points_earned integer,
  total_points integer,
  access_status public.membership_status
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lab public.labs%rowtype;
  v_expected_hash text;
  v_candidate text;
  v_profile public.profiles%rowtype;
  v_already_solved boolean;
  v_next_status public.membership_status;
  v_total integer;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión para enviar una flag';
  end if;

  select l.*
    into v_lab
  from public.labs l
  join public.challenge_secrets s on s.lab_id = l.id
  where l.id = p_lab_id and l.is_published;

  if not found then
    raise exception 'Reto no disponible';
  end if;

  select s.flag_hash into v_expected_hash
  from public.challenge_secrets s
  where s.lab_id = v_lab.id;

  select * into v_profile from public.profiles where id = auth.uid() for update;
  if not found or v_profile.access_status = 'suspended' then
    raise exception 'Tu cuenta no tiene acceso a este reto';
  end if;

  if v_lab.is_members_only and v_profile.access_status not in ('member', 'admin') then
    raise exception 'Completa primero el CTF de admisión';
  end if;

  v_candidate := lower(btrim(coalesce(p_flag, '')));
  if v_candidate ~ '^htb\{.*\}$' then
    v_candidate := substring(v_candidate from '^htb\{(.*)\}$');
  end if;

  if encode(digest(v_candidate, 'sha256'), 'hex') <> v_expected_hash then
    return query select false, false, 0, v_profile.points, v_profile.access_status;
    return;
  end if;

  select exists(
    select 1 from public.user_solves
    where user_id = auth.uid() and lab_id = p_lab_id
  ) into v_already_solved;

  if v_already_solved then
    return query select true, true, 0, v_profile.points, v_profile.access_status;
    return;
  end if;

  insert into public.user_solves (user_id, lab_id, points_earned)
  values (auth.uid(), p_lab_id, v_lab.points);

  v_next_status := case
    when v_lab.is_admission_challenge and v_profile.access_status = 'applicant' then 'member'::public.membership_status
    else v_profile.access_status
  end;
  v_total := v_profile.points + v_lab.points;

  update public.profiles
  set points = v_total,
      rank = public.rank_for_points(v_total),
      access_status = v_next_status,
      updated_at = now()
  where id = auth.uid();

  return query select true, false, v_lab.points, v_total, v_next_status;
end;
$$;

create or replace function public.get_challenge_writeup(p_lab_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  v_writeup text;
begin
  if auth.uid() is null then
    raise exception 'Debes iniciar sesión para acceder al writeup';
  end if;

  if not public.is_admin() and not exists (
    select 1 from public.user_solves
    where user_id = auth.uid() and lab_id = p_lab_id
  ) then
    raise exception 'Resuelve el reto para desbloquear el writeup';
  end if;

  select writeup_markdown into v_writeup
  from public.challenge_secrets where lab_id = p_lab_id;
  return v_writeup;
end;
$$;

create or replace function public.create_challenge(
  p_title text,
  p_slug text,
  p_difficulty text,
  p_category text,
  p_description text,
  p_flag text,
  p_writeup_markdown text,
  p_zip_url text default null,
  p_is_admission_challenge boolean default false,
  p_is_members_only boolean default true,
  p_framework text default null,
  p_tags text[] default '{}',
  p_estimated_minutes integer default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_lab_id uuid;
  v_points integer;
  v_flag text;
begin
  if not public.is_admin() then
    raise exception 'Solo los administradores pueden crear retos';
  end if;

  if btrim(coalesce(p_flag, '')) = '' then
    raise exception 'La flag es obligatoria';
  end if;

  v_points := case p_difficulty
    when 'Easy' then 100
    when 'Medium' then 250
    when 'Hard' then 500
    when 'Insane' then 1000
    else 0
  end;
  if v_points = 0 then
    raise exception 'Dificultad inválida';
  end if;
  v_flag := lower(btrim(p_flag));
  if v_flag ~ '^htb\{.*\}$' then
    v_flag := substring(v_flag from '^htb\{(.*)\}$');
  end if;

  insert into public.labs (
    title, slug, difficulty, category, description, zip_url, author, points,
    is_published, is_admission_challenge, is_members_only, framework, tags, estimated_minutes
  ) values (
    btrim(p_title), btrim(p_slug), p_difficulty, p_category, coalesce(p_description, ''), p_zip_url,
    (select username from public.profiles where id = auth.uid()), v_points,
    false, p_is_admission_challenge, p_is_members_only, p_framework, coalesce(p_tags, '{}'), p_estimated_minutes
  ) returning id into v_lab_id;

  insert into public.challenge_secrets (lab_id, flag_hash, writeup_markdown)
  values (v_lab_id, encode(digest(v_flag, 'sha256'), 'hex'), coalesce(p_writeup_markdown, ''));

  return v_lab_id;
end;
$$;

-- The public ranking exposes only display fields and aggregate solve counts;
-- individual solve records remain private to the corresponding user.
create or replace function public.get_leaderboard()
returns table (
  user_id uuid,
  username text,
  full_name text,
  avatar_url text,
  points integer,
  rank text,
  specialty text,
  solved_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    p.id,
    p.username,
    p.full_name,
    p.avatar_url,
    p.points,
    p.rank,
    p.specialty,
    count(s.id) as solved_count
  from public.profiles p
  left join public.user_solves s on s.user_id = p.id
  where p.access_status <> 'suspended'
  group by p.id
  order by p.points desc, count(s.id) desc, p.created_at asc;
$$;

revoke all on function public.submit_flag(uuid, text) from public;
revoke all on function public.get_challenge_writeup(uuid) from public;
revoke all on function public.create_challenge(text, text, text, text, text, text, text, text, boolean, boolean, text, text[], integer) from public;
revoke all on function public.get_leaderboard() from public;
grant execute on function public.submit_flag(uuid, text) to authenticated;
grant execute on function public.get_challenge_writeup(uuid) to authenticated;
grant execute on function public.create_challenge(text, text, text, text, text, text, text, text, boolean, boolean, text, text[], integer) to authenticated;
grant execute on function public.get_leaderboard() to anon, authenticated;

-- Replace this UUID with the account that administers the group, after that user
-- has signed in at least once and its profile exists.
-- update public.profiles set access_status = 'admin' where id = 'YOUR_AUTH_USER_UUID';

commit;
