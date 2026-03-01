import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const dbUrl = process.env.DATABASE_URL;
    console.log('Checking DATABASE_URL project...');

    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        const res = await client.query("SELECT count(*) FROM information_schema.tables WHERE table_name = 'employees'");
        console.log('Employees table exists count:', res.rows[0].count);

        if (res.rows[0].count > 0) {
            const schemaRes = await client.query("SELECT table_schema FROM information_schema.tables WHERE table_name = 'employees'");
            console.log('Schema:', schemaRes.rows[0].table_schema);
        }
    } catch (err) {
        console.error('Connection Error:', err.message);
    } finally {
        await client.end();
    }
}

check();
