import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const schemas = [
    'public',
    'fs_a0c74478-27e0-49a7-80e6-af701b542a05_agent_1',
    'auth',
    'storage'
];

async function check() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    for (const schema of schemas) {
        console.log(`Checking schema: ${schema}...`);
        const supabase = createClient(url, key, { db: { schema } });
        const { error } = await supabase.from('employees').select('id').limit(1);

        if (error) {
            console.log(`  - No employees table in ${schema}: ${error.message}`);
        } else {
            console.log(`  - FOUND employees table in ${schema}!`);
            return;
        }
    }
}

check();
