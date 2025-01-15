-- Drop existing functions to recreate them
drop function if exists public.get_user_roles(uuid);
drop function if exists public.sync_user_roles_to_auth();

-- Function to get user roles with named column
create or replace function public.get_user_roles(user_id uuid)
returns table (role app_role) as $$
  select role from public.user_roles where user_id = $1;
$$ language sql security definer;

-- Fixed trigger function
create or replace function public.sync_user_roles_to_auth()
returns trigger as $$
declare
  roles text[];
  permissions text[];
begin
  -- Get user roles as array
  select array_agg(r.role::text)
  into roles
  from public.get_user_roles(new.user_id) r;

  -- Get user permissions as array
  select array_agg(p::text)
  into permissions
  from public.get_user_permissions(new.user_id) p;

  -- Update auth.users
  update auth.users set raw_app_meta_data = jsonb_set(
    jsonb_set(
      coalesce(raw_app_meta_data, '{}'::jsonb),
      '{roles}',
      to_jsonb(roles)
    ),
    '{permissions}',
    to_jsonb(permissions)
  )
  where id = new.user_id;

  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
create trigger sync_user_roles
after insert or update or delete on public.user_roles
for each row execute function public.sync_user_roles_to_auth();