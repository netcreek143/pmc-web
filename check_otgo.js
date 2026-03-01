import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const dbUrl = process.env.DATABASE_URL;
    const client = new pg.Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

    try {
        await client.connect();
        const res = await client.query("SELECT count(*) FROM products");
        console.log('Products in DATABASE_URL project:', res.rows[0].count);
    } catch (err) {
        console.error('Connection Error:', err.message);
    } finally {
        await client.end();
    }
}

check();
