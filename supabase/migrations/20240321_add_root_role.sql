-- Add root role to role_permissions
INSERT INTO public.role_permissions (role, permissions)
VALUES ('root', ARRAY['create:users', 'read:users', 'update:users', 'delete:users', 'create:items', 'read:items', 'update:items', 'delete:items', 'create:events', 'read:events', 'update:events', 'delete:events', 'create:stocks', 'read:stocks', 'update:stocks', 'delete:stocks']);

-- Update existing roles to ensure proper hierarchy
UPDATE public.role_permissions
SET permissions = ARRAY['read:items', 'read:events', 'read:stocks']
WHERE role = 'user';

UPDATE public.role_permissions
SET permissions = ARRAY['create:items', 'read:items', 'update:items', 'delete:items', 'create:events', 'read:events', 'update:events', 'delete:events', 'create:stocks', 'read:stocks', 'update:stocks', 'delete:stocks']
WHERE role = 'admin';

insert into public.user_roles (user_id, role)
select id, 'root'::public.app_role
from auth.users
where email = 'pabloezeromano@gmail.com'
and not exists (
  select 1 from public.user_roles where user_id = auth.users.id and role = 'root'
);
