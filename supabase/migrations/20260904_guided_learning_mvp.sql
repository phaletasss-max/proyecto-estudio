-- ShadowBytes guided-learning security layer.
-- Apply after 20260831_secure_ctf_admission.sql.

begin;

create extension if not exists pgcrypto;

alter table public.profiles alter column avatar_url set default '';
update public.profiles set avatar_url = '' where avatar_url like 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde%';

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
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
    insert into public.profiles(id, username, full_name, avatar_url, access_status)
    values (
      new.id,
      v_username,
      coalesce(nullif(btrim(new.raw_user_meta_data->>'full_name'), ''), 'Estudiante ShadowBytes'),
      coalesce(nullif(btrim(new.raw_user_meta_data->>'avatar_url'), ''), ''),
      'applicant'
    ) on conflict (id) do nothing;
  exception when unique_violation then
    v_username := left(v_base_username, 19) || '_' || left(replace(new.id::text, '-', ''), 8);
    insert into public.profiles(id, username, full_name, avatar_url, access_status)
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

create table if not exists public.lab_steps (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.labs(id) on delete cascade,
  step_number integer not null check (step_number > 0),
  title text not null,
  description text not null default '',
  question text,
  answer_format text,
  hint_count integer not null default 0 check (hint_count >= 0),
  points integer not null default 0 check (points between 0 and 1000),
  created_at timestamptz not null default now(),
  unique (lab_id, step_number)
);

create table if not exists public.lab_step_secrets (
  step_id uuid primary key references public.lab_steps(id) on delete cascade,
  answer_hash text not null check (length(answer_hash) = 64),
  explanation text not null default ''
);

create table if not exists public.lab_hints (
  id uuid primary key default gen_random_uuid(),
  step_id uuid not null references public.lab_steps(id) on delete cascade,
  hint_number integer not null check (hint_number > 0),
  content text not null,
  point_penalty integer not null default 0 check (point_penalty between 0 and 1000),
  unique (step_id, hint_number)
);

alter table public.lab_steps add column if not exists hint_count integer not null default 0 check (hint_count >= 0);

create or replace function public.sync_lab_step_hint_count()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_step_id uuid;
begin
  v_step_id := case when tg_op = 'DELETE' then old.step_id else new.step_id end;
  update public.lab_steps set hint_count = (select count(*) from public.lab_hints where step_id = v_step_id) where id = v_step_id;
  if tg_op = 'UPDATE' and old.step_id is distinct from new.step_id then
    update public.lab_steps set hint_count = (select count(*) from public.lab_hints where step_id = old.step_id) where id = old.step_id;
  end if;
  if tg_op = 'DELETE' then return old; end if;
  return new;
end;
$$;
drop trigger if exists on_lab_hint_change on public.lab_hints;
create trigger on_lab_hint_change after insert or update or delete on public.lab_hints
for each row execute function public.sync_lab_step_hint_count();
update public.lab_steps s set hint_count = (select count(*) from public.lab_hints h where h.step_id = s.id);

create table if not exists public.lab_step_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_id uuid not null references public.lab_steps(id) on delete cascade,
  points_earned integer not null default 0 check (points_earned >= 0),
  completed_at timestamptz not null default now(),
  primary key (user_id, step_id)
);

create table if not exists public.user_hint_unlocks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  hint_id uuid not null references public.lab_hints(id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, hint_id)
);

create table if not exists public.flag_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  lab_id uuid not null references public.labs(id) on delete cascade,
  accepted boolean not null,
  attempted_at timestamptz not null default now()
);

create table if not exists public.step_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  step_id uuid not null references public.lab_steps(id) on delete cascade,
  accepted boolean not null,
  attempted_at timestamptz not null default now()
);

create index if not exists idx_lab_steps_lab_order on public.lab_steps(lab_id, step_number);
create index if not exists idx_lab_hints_step_order on public.lab_hints(step_id, hint_number);
create index if not exists idx_flag_attempts_rate on public.flag_attempts(user_id, lab_id, attempted_at desc);
create index if not exists idx_step_attempts_rate on public.step_attempts(user_id, step_id, attempted_at desc);

alter table public.lab_steps enable row level security;
alter table public.lab_step_secrets enable row level security;
alter table public.lab_hints enable row level security;
alter table public.lab_step_progress enable row level security;
alter table public.user_hint_unlocks enable row level security;
alter table public.flag_attempts enable row level security;
alter table public.step_attempts enable row level security;

drop policy if exists "Visible steps follow visible labs" on public.lab_steps;
create policy "Visible steps follow visible labs" on public.lab_steps for select
using (exists (
  select 1 from public.labs l
  where l.id = lab_id and l.is_published
    and (l.is_admission_challenge or not l.is_members_only or public.has_member_access())
));

drop policy if exists "Users read own step progress" on public.lab_step_progress;
create policy "Users read own step progress" on public.lab_step_progress for select using (auth.uid() = user_id);
drop policy if exists "Users read own hint unlocks" on public.user_hint_unlocks;
create policy "Users read own hint unlocks" on public.user_hint_unlocks for select using (auth.uid() = user_id);

revoke all on public.lab_steps, public.lab_step_secrets, public.lab_hints, public.lab_step_progress, public.user_hint_unlocks, public.flag_attempts, public.step_attempts from anon, authenticated;
grant select on public.lab_steps to anon, authenticated;
grant select on public.lab_step_progress, public.user_hint_unlocks to authenticated;

create or replace function public.normalize_challenge_value(p_value text)
returns text language sql immutable strict set search_path = public as $$
  select case
    when lower(btrim(p_value)) ~ '^(htb|sb)\{.*\}$'
      then regexp_replace(lower(btrim(p_value)), '^(htb|sb)\{(.*)\}$', '\2')
    else lower(btrim(p_value))
  end
$$;
revoke all on function public.normalize_challenge_value(text) from public, anon, authenticated;

create or replace function public.submit_step_answer(p_step_id uuid, p_answer text)
returns table (accepted boolean, already_completed boolean, points_earned integer, explanation text)
language plpgsql security definer set search_path = public as $$
declare
  v_step public.lab_steps%rowtype;
  v_hash text;
  v_explanation text;
  v_status public.membership_status;
  v_valid boolean;
  v_penalty integer;
  v_points integer;
  v_awarded integer;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  if length(coalesce(p_answer, '')) > 500 then raise exception 'Respuesta inválida'; end if;

  select access_status into v_status
  from public.profiles
  where id = auth.uid()
  for update;
  if not found or v_status = 'suspended' then raise exception 'Tu cuenta no tiene acceso'; end if;

  if (select count(*) from public.step_attempts where user_id = auth.uid() and step_id = p_step_id and attempted_at > now() - interval '5 minutes') >= 15 then
    raise exception 'Demasiados intentos. Espera cinco minutos';
  end if;

  select s.* into v_step
  from public.lab_steps s join public.lab_step_secrets secret on secret.step_id = s.id
  join public.labs l on l.id = s.lab_id
  where s.id = p_step_id and l.is_published
    and (l.is_admission_challenge or not l.is_members_only or public.has_member_access());
  if not found then raise exception 'Paso no disponible'; end if;

  select secret.answer_hash, secret.explanation into v_hash, v_explanation
  from public.lab_step_secrets secret
  where secret.step_id = v_step.id;

  if exists (select 1 from public.lab_step_progress where user_id = auth.uid() and step_id = p_step_id) then
    return query select true, true, 0, v_explanation;
    return;
  end if;

  if exists (
    select 1
    from public.lab_steps previous
    join public.lab_step_secrets previous_secret on previous_secret.step_id = previous.id
    where previous.lab_id = v_step.lab_id
      and previous.step_number < v_step.step_number
      and not exists (
        select 1 from public.lab_step_progress progress
        where progress.user_id = auth.uid() and progress.step_id = previous.id
      )
  ) then
    raise exception 'Completa primero los pasos anteriores';
  end if;

  v_valid := encode(digest(public.normalize_challenge_value(coalesce(p_answer, '')), 'sha256'), 'hex') = v_hash;
  insert into public.step_attempts(user_id, step_id, accepted) values (auth.uid(), p_step_id, v_valid);
  if not v_valid then return query select false, false, 0, ''::text; return; end if;

  select coalesce(sum(h.point_penalty), 0) into v_penalty
  from public.user_hint_unlocks u join public.lab_hints h on h.id = u.hint_id
  where u.user_id = auth.uid() and h.step_id = p_step_id;
  v_points := greatest(0, v_step.points - v_penalty);
  insert into public.lab_step_progress(user_id, step_id, points_earned)
  values (auth.uid(), p_step_id, v_points)
  on conflict do nothing
  returning lab_step_progress.points_earned into v_awarded;
  if v_awarded is null then
    return query select true, true, 0, v_explanation;
  else
    return query select true, false, v_awarded, v_explanation;
  end if;
end;
$$;

create or replace function public.preview_next_hint(p_step_id uuid)
returns table (hint_number integer, point_penalty integer)
language plpgsql stable security definer set search_path = public as $$
declare v_status public.membership_status;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  select access_status into v_status from public.profiles where id = auth.uid();
  if not found or v_status = 'suspended' then raise exception 'Tu cuenta no tiene acceso'; end if;
  if not exists (
    select 1 from public.lab_steps s join public.labs l on l.id = s.lab_id
    where s.id = p_step_id and l.is_published
      and (l.is_admission_challenge or not l.is_members_only or public.has_member_access())
  ) then raise exception 'Paso no disponible'; end if;
  if exists (select 1 from public.lab_step_progress where user_id = auth.uid() and step_id = p_step_id) then
    return;
  end if;

  return query
  select h.hint_number, h.point_penalty
  from public.lab_hints h
  where h.step_id = p_step_id and not exists (
    select 1 from public.user_hint_unlocks u where u.user_id = auth.uid() and u.hint_id = h.id
  )
  order by h.hint_number
  limit 1;
end;
$$;

create or replace function public.get_unlocked_hints(p_step_id uuid)
returns table (hint_number integer, content text, point_penalty integer)
language plpgsql stable security definer set search_path = public as $$
declare v_status public.membership_status;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  select access_status into v_status from public.profiles where id = auth.uid();
  if not found or v_status = 'suspended' then raise exception 'Tu cuenta no tiene acceso'; end if;
  if not exists (
    select 1 from public.lab_steps s join public.labs l on l.id = s.lab_id
    where s.id = p_step_id and l.is_published
      and (l.is_admission_challenge or not l.is_members_only or public.has_member_access())
  ) then raise exception 'Paso no disponible'; end if;

  return query
  select h.hint_number, h.content, h.point_penalty
  from public.user_hint_unlocks u
  join public.lab_hints h on h.id = u.hint_id
  where u.user_id = auth.uid() and h.step_id = p_step_id
  order by h.hint_number;
end;
$$;

create or replace function public.get_next_hint(p_step_id uuid)
returns table (hint_number integer, content text, point_penalty integer)
language plpgsql security definer set search_path = public as $$
declare
  v_hint public.lab_hints%rowtype;
  v_status public.membership_status;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  select access_status into v_status
  from public.profiles
  where id = auth.uid()
  for update;
  if not found or v_status = 'suspended' then raise exception 'Tu cuenta no tiene acceso'; end if;
  if not exists (
    select 1 from public.lab_steps s join public.labs l on l.id = s.lab_id
    where s.id = p_step_id and l.is_published
      and (l.is_admission_challenge or not l.is_members_only or public.has_member_access())
  ) then raise exception 'Paso no disponible'; end if;
  if exists (select 1 from public.lab_step_progress where user_id = auth.uid() and step_id = p_step_id) then
    raise exception 'El paso ya está resuelto';
  end if;

  select h.* into v_hint from public.lab_hints h
  where h.step_id = p_step_id and not exists (
    select 1 from public.user_hint_unlocks u where u.user_id = auth.uid() and u.hint_id = h.id
  ) order by h.hint_number limit 1;
  if not found then return; end if;
  insert into public.user_hint_unlocks(user_id, hint_id) values (auth.uid(), v_hint.id) on conflict do nothing;
  return query select v_hint.hint_number, v_hint.content, v_hint.point_penalty;
end;
$$;

create or replace function public.submit_flag(p_lab_id uuid, p_flag text)
returns table (accepted boolean, already_solved boolean, points_earned integer, total_points integer, access_status public.membership_status)
language plpgsql security definer set search_path = public as $$
declare
  v_lab public.labs%rowtype;
  v_expected text;
  v_profile public.profiles%rowtype;
  v_valid boolean;
  v_next public.membership_status;
  v_penalty integer;
  v_award integer;
  v_inserted_points integer;
  v_total integer;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión para enviar una flag'; end if;
  if length(coalesce(p_flag, '')) > 500 then raise exception 'Flag inválida'; end if;

  select * into v_profile from public.profiles where id = auth.uid() for update;
  if not found or v_profile.access_status = 'suspended' then raise exception 'Tu cuenta no tiene acceso'; end if;

  if (select count(*) from public.flag_attempts where user_id = auth.uid() and lab_id = p_lab_id and attempted_at > now() - interval '5 minutes') >= 10 then
    raise exception 'Demasiados intentos. Espera cinco minutos';
  end if;
  select l.* into v_lab from public.labs l join public.challenge_secrets s on s.lab_id = l.id where l.id = p_lab_id and l.is_published;
  if not found then raise exception 'Reto no disponible'; end if;
  select s.flag_hash into v_expected from public.challenge_secrets s where s.lab_id = v_lab.id;
  if v_lab.is_members_only and not v_lab.is_admission_challenge and v_profile.access_status not in ('member', 'admin') then raise exception 'Completa primero el CTF de admisión'; end if;

  if exists (
    select 1
    from public.lab_steps step
    join public.lab_step_secrets secret on secret.step_id = step.id
    where step.lab_id = p_lab_id
      and not exists (
        select 1 from public.lab_step_progress progress
        where progress.user_id = auth.uid() and progress.step_id = step.id
      )
  ) then
    raise exception 'Completa las preguntas guiadas antes de enviar la flag final';
  end if;

  v_valid := v_expected in (
    encode(digest(public.normalize_challenge_value(coalesce(p_flag, '')), 'sha256'), 'hex'),
    encode(digest(lower(btrim(coalesce(p_flag, ''))), 'sha256'), 'hex')
  );
  insert into public.flag_attempts(user_id, lab_id, accepted) values (auth.uid(), p_lab_id, v_valid);
  if not v_valid then return query select false, false, 0, v_profile.points, v_profile.access_status; return; end if;

  select coalesce(sum(h.point_penalty), 0) into v_penalty
  from public.user_hint_unlocks unlock
  join public.lab_hints h on h.id = unlock.hint_id
  join public.lab_steps step on step.id = h.step_id
  where unlock.user_id = auth.uid() and step.lab_id = p_lab_id;
  v_award := greatest(0, v_lab.points - v_penalty);

  insert into public.user_solves(user_id, lab_id, points_earned)
  values (auth.uid(), p_lab_id, v_award)
  on conflict (user_id, lab_id) do nothing
  returning user_solves.points_earned into v_inserted_points;
  if v_inserted_points is null then return query select true, true, 0, v_profile.points, v_profile.access_status; return; end if;

  v_next := case when v_lab.is_admission_challenge and v_profile.access_status = 'applicant' then 'member'::public.membership_status else v_profile.access_status end;
  v_total := v_profile.points + v_inserted_points;
  update public.profiles set points = v_total, rank = public.rank_for_points(v_total), access_status = v_next, updated_at = now() where id = auth.uid();
  return query select true, false, v_inserted_points, v_total, v_next;
end;
$$;

revoke all on function public.submit_step_answer(uuid, text), public.get_next_hint(uuid), public.submit_flag(uuid, text) from public, anon;
grant execute on function public.submit_step_answer(uuid, text), public.get_next_hint(uuid), public.submit_flag(uuid, text) to authenticated;
revoke all on function public.get_challenge_writeup(uuid) from public, anon;
grant execute on function public.get_challenge_writeup(uuid) to authenticated;
revoke all on function public.create_challenge(text, text, text, text, text, text, text, text, boolean, boolean, text, text[], integer) from public, anon;
grant execute on function public.create_challenge(text, text, text, text, text, text, text, text, boolean, boolean, text, text[], integer) to authenticated;

-- Files stay private. The database stores an object path, never a public URL.
insert into storage.buckets(id, name, public, file_size_limit, allowed_mime_types)
values ('ctf-zips', 'ctf-zips', false, 26214400, array['application/zip', 'application/x-zip-compressed'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Members can download challenge files" on storage.objects;
create policy "Members can download challenge files" on storage.objects for select to authenticated
using (
  bucket_id = 'ctf-zips' and (
    public.has_member_access()
    or exists (select 1 from public.labs l where l.zip_url = name and l.is_published and l.is_admission_challenge)
  )
);
drop policy if exists "Admins manage challenge files" on storage.objects;
create policy "Admins manage challenge files" on storage.objects for all to authenticated
using (bucket_id = 'ctf-zips' and public.is_admin()) with check (bucket_id = 'ctf-zips' and public.is_admin());

revoke all on function public.preview_next_hint(uuid), public.get_unlocked_hints(uuid) from public, anon;
grant execute on function public.preview_next_hint(uuid), public.get_unlocked_hints(uuid) to authenticated;

-- RLS does not protect TRUNCATE; remove legacy grants explicitly.
revoke insert, update, delete, truncate, references, trigger on public.profiles from anon;
revoke insert, delete, truncate, references, trigger on public.profiles from authenticated;
revoke insert, update, delete, truncate, references, trigger on public.badges from anon, authenticated;

notify pgrst, 'reload schema';

commit;
