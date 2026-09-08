-- Supabase installs pgcrypto in extensions; SQL Editor's search_path is not
-- inherited by SECURITY DEFINER functions. Keep flag validation working there.
begin;
alter function public.submit_flag(uuid, text) set search_path = public, extensions;
alter function public.submit_step_answer(uuid, text) set search_path = public, extensions;
alter function public.create_challenge(text, text, text, text, text, text, text, text, boolean, boolean, text, text[], integer) set search_path = public, extensions;
notify pgrst, 'reload schema';
commit;
