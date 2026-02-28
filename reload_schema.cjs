require('dotenv').config();
const { Client } = require('pg');

async function reload() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    try {
        await client.connect();
        await client.query("NOTIFY pgrst, 'reload schema'");
        console.log('Schema cache reloaded.');
    } catch (err) {
        console.error(err);
    } finally {
        await client.end();
    }
}
reload();
