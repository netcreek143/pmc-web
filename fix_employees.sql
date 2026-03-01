-- SQL to create the employees table on your active Supabase project (qoeqwtjjyilzcyliwdkh)
-- Run this in your Supabase Dashboard -> SQL Editor

CREATE TABLE IF NOT EXISTS public.employees (
  id            serial primary key,
  employee_id   text unique,
  name          text not null,
  father_name   text,
  address       text,
  qualification text,
  email         text unique,
  gender        text,
  dob           date,
  mobile        text,
  designation   text,
  join_date     date default current_date,
  username      text unique,
  password_hash text,
  permissions   jsonb default '[]'::jsonb,
  status        text default 'active',
  created_at    timestamptz default now()
);

-- Ensure anyone with the API key can access it (disable RLS for now as requested)
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
