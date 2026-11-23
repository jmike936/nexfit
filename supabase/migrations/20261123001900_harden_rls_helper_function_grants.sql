-- NEXFIT: restrict SECURITY DEFINER helper functions to trusted application roles.
-- These helpers are used by RLS policies and authenticated RPC flows; PUBLIC execution
-- is unnecessary and exposes authorization predicates/RPC entry points to anon clients.
begin;

revoke all on function public.nexfit_can_manage_program(uuid) from public;
revoke all on function public.nexfit_can_read_program(uuid) from public;
revoke all on function public.nexfit_request_access_by_email(text) from public;

grant execute on function public.nexfit_can_manage_program(uuid) to authenticated, service_role;
grant execute on function public.nexfit_can_read_program(uuid) to authenticated, service_role;
grant execute on function public.nexfit_request_access_by_email(text) to authenticated, service_role;

commit;
