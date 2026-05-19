-- SQL Schema para la tabla Profiles (Registro B2B / B2C)
-- Por favor, corre este script en el SQL Editor de tu Dashboard de Supabase.

-- Crear la tabla profiles
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  entity_type text check (entity_type in ('NATURAL', 'COMPANY')) not null,
  full_name text,
  company_name text,
  tax_id text,
  pvm text,
  country text,
  stripe_customer_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habilitar Row Level Security (RLS) para seguridad
alter table public.profiles enable row level security;

-- Políticas de RLS
create policy "Los usuarios pueden ver su propio perfil." 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Los usuarios pueden insertar su propio perfil." 
  on public.profiles for insert 
  with check (auth.uid() = id);

create policy "Los usuarios pueden actualizar su propio perfil." 
  on public.profiles for update 
  using (auth.uid() = id);

-- Activar extensión moddatetime si no existe (opcional, para actualizar updated_at automáticamente)
create extension if not exists moddatetime schema extensions;

-- Crear el trigger para actualizar updated_at
drop trigger if exists handle_updated_at on public.profiles;
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure moddatetime (updated_at);
