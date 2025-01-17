-- Add root role to app_role type
DO $$ BEGIN
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'root';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add user management permissions
DO $$ BEGIN
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'users.create';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'users.read';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'users.update';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'users.delete';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'items.create';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'items.read';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'items.update';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'items.delete';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'events.create';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'events.read';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'events.update';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'events.delete';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'stocks.create';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'stocks.read';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'stocks.update';
    ALTER TYPE public.app_permission ADD VALUE IF NOT EXISTS 'stocks.delete';
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Add root role permissions
INSERT INTO
  public.role_permissions (role, permission)
VALUES
  ('root', 'users.create'),
  ('root', 'users.read'),
  ('root', 'users.update'),
  ('root', 'users.delete'),
  ('root', 'items.create'),
  ('root', 'items.read'),
  ('root', 'items.update'),
  ('root', 'items.delete'),
  ('root', 'events.create'),
  ('root', 'events.read'),
  ('root', 'events.update'),
  ('root', 'events.delete'),
  ('root', 'stocks.create'),
  ('root', 'stocks.read'),
  ('root', 'stocks.update'),
  ('root', 'stocks.delete');

-- Update existing roles to ensure proper hierarchy
INSERT INTO public.role_permissions (role, permission)
VALUES
  ('user', 'items.read'::public.app_permission),
  ('user', 'events.read'::public.app_permission),
  ('user', 'stocks.read'::public.app_permission)
ON CONFLICT (role, permission) DO NOTHING;

-- Set initial root user
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM public.user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        WHERE u.email = 'pabloezeromano@gmail.com' AND ur.role = 'root'
    ) THEN
        INSERT INTO public.user_roles (user_id, role)
        SELECT id, 'root'::public.app_role
        FROM auth.users
        WHERE email = 'pabloezeromano@gmail.com';
    END IF;
END
$$;

-- Create function to check user roles
CREATE OR REPLACE FUNCTION public.check_user_role(required_roles text[])
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.user_roles ur
        WHERE ur.user_id = auth.uid()
        AND ur.role = ANY(required_roles::public.app_role[])
    );
END;
$$;

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for events table
DROP POLICY IF EXISTS "Enable read access for all users" ON public.events;
DROP POLICY IF EXISTS "Enable insert for admin and root users" ON public.events;
DROP POLICY IF EXISTS "Enable update for admin and root users" ON public.events;
DROP POLICY IF EXISTS "Enable delete for admin and root users" ON public.events;

CREATE POLICY "Enable read access for all users" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin and root users" ON public.events
    FOR INSERT
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable update for admin and root users" ON public.events
    FOR UPDATE
    USING (public.check_user_role(ARRAY['admin', 'root']))
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable delete for admin and root users" ON public.events
    FOR DELETE
    USING (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable read access for all users" ON public.items
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for admin and root users" ON public.items
    FOR INSERT
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable update for admin and root users" ON public.items
    FOR UPDATE
    USING (public.check_user_role(ARRAY['admin', 'root']))
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable delete for admin and root users" ON public.items
    FOR DELETE
    USING (public.check_user_role(ARRAY['admin', 'root']));

ALTER TABLE public.stocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for admin and root users" ON public.stocks
    FOR SELECT USING (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable insert for admin and root users" ON public.stocks
    FOR INSERT
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable update for admin and root users" ON public.stocks
    FOR UPDATE
    USING (public.check_user_role(ARRAY['admin', 'root']))
    WITH CHECK (public.check_user_role(ARRAY['admin', 'root']));

CREATE POLICY "Enable delete for admin and root users" ON public.stocks
    FOR DELETE
    USING (public.check_user_role(ARRAY['admin', 'root']));

