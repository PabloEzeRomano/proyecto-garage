-- Create a new storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true);

-- Allow public access to view images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'images' );

-- Allow authenticated users to upload images
create policy "Authenticated users can upload images"
on storage.objects for insert
to authenticated
with check (
    bucket_id = 'images'
    and (storage.foldername(name))[1] != 'private'
);

-- Allow users to update and delete their own images
create policy "Users can update own images"
on storage.objects for update
to authenticated
using ( auth.uid() = owner );

create policy "Users can delete own images"
on storage.objects for delete
to authenticated
using ( auth.uid() = owner );

-- Function to migrate existing images to storage
create or replace function migrate_existing_images()
returns void
language plpgsql
security definer
as $$
declare
    event_record record;
    item_record record;
    new_url text;
begin
    -- Migrate event images
    for event_record in
        select id, image_url
        from public.events
        where image_url is not null
        and not image_url like 'https://%supabase%'
    loop
        -- Copy image to storage and get new URL
        -- Note: This is a placeholder. The actual implementation would need to handle the file transfer
        -- new_url := storage_url_after_migration;

        -- Update event with new URL
        update public.events
        set image_url = new_url
        where id = event_record.id;
    end loop;

    -- Migrate item images
    for item_record in
        select id, image_url
        from public.items
        where image_url is not null
        and not image_url like 'https://%supabase%'
    loop
        -- Copy image to storage and get new URL
        -- Note: This is a placeholder. The actual implementation would need to handle the file transfer
        -- new_url := storage_url_after_migration;

        -- Update item with new URL
        update public.items
        set image_url = new_url
        where id = item_record.id;
    end loop;
end;
$$;

-- Add URL validation check to tables
alter table public.events
    add constraint valid_image_url
    check (
        image_url is null or
        image_url like 'https://%supabase%' or
        image_url like 'data:%'
    );

alter table public.items
    add constraint valid_image_url
    check (
        image_url is null or
        image_url like 'https://%supabase%' or
        image_url like 'data:%'
    );

-- Note: The actual migration of existing images should be handled by a separate
-- application-level script, as it requires downloading and uploading files.
-- This migration only sets up the necessary infrastructure.