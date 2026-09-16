-- Downloads follow the published lab's access, including open beginner labs.
-- Files remain in the private bucket and are delivered through expiring URLs.
begin;

drop policy if exists "Members can download challenge files" on storage.objects;
create policy "Members can download challenge files" on storage.objects for select to authenticated
using (
  bucket_id = 'ctf-zips'
  and exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.access_status <> 'suspended')
  and exists (
    select 1 from public.labs l where (l.zip_url = name or starts_with(name, l.slug || '/evidence/')) and l.is_published
    and (not l.is_members_only or l.is_admission_challenge or public.has_member_access())
  )
);

update storage.buckets set allowed_mime_types = array['application/zip', 'application/x-zip-compressed', 'text/plain']
where id = 'ctf-zips';

alter table public.profiles alter column bio set default 'Integrante de la comunidad ShadowBytes.';
update public.profiles set bio = 'Integrante de la comunidad ShadowBytes.'
where bio = 'Estudiante y Miembro de ShadowBytes SENATI';

-- A concurrent tab must not unlock a different, more expensive hint than approved.
create or replace function public.reveal_confirmed_hint(p_step_id uuid, p_hint_number integer, p_point_penalty integer)
returns table(hint_number integer, content text, point_penalty integer)
language plpgsql security definer set search_path = public as $$
declare v_next record;
begin
  if auth.uid() is null then raise exception 'Debes iniciar sesión'; end if;
  perform 1 from public.profiles where id = auth.uid() for update;
  select * into v_next from public.preview_next_hint(p_step_id);
  if not found then raise exception 'No hay más pistas disponibles'; end if;
  if v_next.hint_number is distinct from p_hint_number or v_next.point_penalty is distinct from p_point_penalty then
    raise exception 'La pista cambió. Consulta su coste de nuevo';
  end if;
  return query select * from public.get_next_hint(p_step_id);
end;
$$;
revoke all on function public.reveal_confirmed_hint(uuid, integer, integer) from public, anon;
grant execute on function public.reveal_confirmed_hint(uuid, integer, integer) to authenticated;
notify pgrst, 'reload schema';
commit;
