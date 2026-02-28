import pg from 'pg';
const dbUrl = process.env.DATABASE_URL || "postgresql://app_fs_a0c74478-27e0-49a7-80e6-af701b542a05_agent_1:baF4kY-eEcmQiAphLelgnazYlXEah0uh@db.otgopumbastbjnkhikjd.supabase.co:5432/postgres?options=-c%20search_path%3Dfs_a0c74478-27e0-49a7-80e6-af701b542a05_agent_1";
const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
client.connect().then(() => client.query("NOTIFY pgrst, 'reload schema';")).then(() => { console.log('Reloaded'); client.end(); }).catch(e => { console.error('Error:', e); client.end(); });
