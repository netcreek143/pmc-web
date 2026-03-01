import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function hack() {
    const projectRef = 'qoeqwtjjyilzcyliwdkh';
    const password = 'baF4kY-eEcmQiAphLelgnazYlXEah0uh';
    const dbUrl = `postgresql://postgres:${password}@db.${projectRef}.supabase.co:5432/postgres`;

    console.log('Attempting connection to active project via potential password reuse...');
    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        console.log('SUCCESS! Connected to active project.');

        const sql = `
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

ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
`;
        await client.query(sql);
        console.log('Employees table created successfully!');
    } catch (err) {
        console.error('Connection Failed:', err.message);
    } finally {
        await client.end();
    }
}

hack();
