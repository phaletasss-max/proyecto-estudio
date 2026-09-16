-- Study materials and personal practice are independent from scored CTF solves.
begin;
create table if not exists public.study_resources (
  id text primary key check (id ~ '^[a-z0-9-]{1,100}$'),
  title text not null check (length(title) between 1 and 180),
  category text not null,
  source text not null default 'Archivo local',
  objective text not null,
  environment text not null,
  archive_path text,
  archive_parts jsonb not null default '[]'::jsonb,
  archive_bytes bigint not null default 0,
  archive_sha256 text not null check (archive_sha256 ~ '^[a-f0-9]{64}$'),
  writeup_path text,
  readiness text not null default 'needs_writeup' check (readiness in ('needs_writeup','reference_available','guided')),
  import_note text not null default '',
  lab_slug text references public.labs(slug),
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.study_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  resource_id text not null references public.study_resources(id) on delete cascade,
  status text not null default 'queued' check (status in ('queued','practicing','documenting','review','learned')),
  next_action text not null default '' check (length(next_action) <= 500),
  personal_writeup text not null default '' check (length(personal_writeup) <= 30000),
  review_on date,
  updated_at timestamptz not null default now(),
  primary key (user_id, resource_id),
  check (status <> 'learned' or length(trim(personal_writeup)) >= 80)
);
alter table public.study_resources enable row level security;
alter table public.study_progress enable row level security;
revoke all on public.study_resources, public.study_progress from anon;
grant select, insert, update on public.study_resources to authenticated;
grant select, insert, update on public.study_progress to authenticated;

create policy "Study library readers" on public.study_resources for select to authenticated
using (public.has_member_access() and is_published);
create policy "Study library admin read" on public.study_resources for select to authenticated using (public.is_admin());
create policy "Study library admin insert" on public.study_resources for insert to authenticated with check (public.is_admin());
create policy "Study library admin update" on public.study_resources for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "Own study progress read" on public.study_progress for select to authenticated using (user_id = auth.uid() and public.has_member_access());
create policy "Own study progress insert" on public.study_progress for insert to authenticated
with check (user_id = auth.uid() and public.has_member_access() and exists (select 1 from public.study_resources r where r.id = resource_id and r.is_published));
create policy "Own study progress update" on public.study_progress for update to authenticated
using (user_id = auth.uid() and public.has_member_access())
with check (user_id = auth.uid() and public.has_member_access() and exists (select 1 from public.study_resources r where r.id = resource_id and r.is_published));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('study-library', 'study-library', false, 52428800, array['application/zip','application/x-zip-compressed','application/octet-stream','text/markdown','text/plain'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types,
  public = false;
create policy "Study files readers" on storage.objects for select to authenticated
using (bucket_id = 'study-library' and public.has_member_access() and exists (
  select 1 from public.study_resources r where r.is_published and (r.archive_path = name or r.writeup_path = name or exists (
    select 1 from jsonb_array_elements(r.archive_parts) part where part->>'path' = name
  ))
));
create policy "Study files admin read" on storage.objects for select to authenticated using (bucket_id = 'study-library' and public.is_admin());
create policy "Study files admin insert" on storage.objects for insert to authenticated with check (bucket_id = 'study-library' and public.is_admin());
-- Content-addressed objects are immutable. Re-imports reuse the same bytes.
notify pgrst, 'reload schema';
commit;
