-- Rename the table
ALTER TABLE IF EXISTS public.stock RENAME TO stocks;

-- Update foreign key constraint name to match new table name
ALTER TABLE public.stocks RENAME CONSTRAINT stock_item_id_fkey TO stocks_item_id_fkey;

-- Update RLS policies to use new table name
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


-- Add comment to document the change
COMMENT ON TABLE public.stocks IS 'Inventory stock items (renamed from stock)';