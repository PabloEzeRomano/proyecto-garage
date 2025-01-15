-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create tables
create table public.items (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    price float not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.stock (
    id uuid default uuid_generate_v4() primary key,
    item_id uuid references public.items(id) on delete cascade,
    quantity integer not null,
    name text not null,
    cost float not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.events (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    short_description text not null,
    price float,
    date timestamp with time zone not null,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create enum type for user roles
create type user_role as enum ('USER', 'ADMIN');

-- Enable Row Level Security
alter table public.items enable row level security;
alter table public.stock enable row level security;
alter table public.events enable row level security;

-- Create policies
-- Items policies
create policy "Items are viewable by everyone"
    on public.items for select
    using (true);

create policy "Items are insertable by admins only"
    on public.items for insert
    with check (auth.jwt()->>'role' = 'ADMIN');

create policy "Items are updatable by admins only"
    on public.items for update
    using (auth.jwt()->>'role' = 'ADMIN');

create policy "Items are deletable by admins only"
    on public.items for delete
    using (auth.jwt()->>'role' = 'ADMIN');

-- Stock policies
create policy "Stock is viewable by admins only"
    on public.stock for select
    using (auth.jwt()->>'role' = 'ADMIN');

create policy "Stock is insertable by admins only"
    on public.stock for insert
    with check (auth.jwt()->>'role' = 'ADMIN');

create policy "Stock is updatable by admins only"
    on public.stock for update
    using (auth.jwt()->>'role' = 'ADMIN');

create policy "Stock is deletable by admins only"
    on public.stock for delete
    using (auth.jwt()->>'role' = 'ADMIN');

-- Events policies
create policy "Events are viewable by everyone"
    on public.events for select
    using (true);

create policy "Events are insertable by admins only"
    on public.events for insert
    with check (auth.jwt()->>'role' = 'ADMIN');

create policy "Events are updatable by admins only"
    on public.events for update
    using (auth.jwt()->>'role' = 'ADMIN');

create policy "Events are deletable by admins only"
    on public.events for delete
    using (auth.jwt()->>'role' = 'ADMIN');

-- Create function to handle user role assignment
create or replace function public.handle_new_user()
returns trigger as $$
begin
    update auth.users
    set raw_user_meta_data = jsonb_set(
        coalesce(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        '"USER"'
    )
    where id = new.id;
    return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user role assignment
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Create index for role-based queries
create index idx_users_role on auth.users using gin ((raw_user_meta_data->'role'));