-- Add employees table
create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  employee_id text unique,
  name text not null,
  father_name text,
  address text,
  qualification text,
  email text unique,
  password_hash text,
  gender text,
  dob date,
  mobile text,
  designation text,
  join_date date,
  logo_url text,
  documents text[],
  status text default 'active',
  created_at timestamptz default now()
);

alter table employees disable row level security;
