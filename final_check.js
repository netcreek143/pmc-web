import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('Checking project:', url);
    const supabase = createClient(url, key);

    // Try to select
    const { data: selData, error: selErr } = await supabase
        .from('employees')
        .select('*')
        .limit(1);

    if (selErr) {
        console.error('Select Error:', selErr.message);
    } else {
        console.log('Select Success. Data:', selData);
    }

    // Try to insert (dry run via rollback is not possible in Supabase JS, 
    // so we'll just try to insert a dummy and then delete it if it succeeds)
    const dummy = {
        employee_id: 'TEST-TEMP-' + Date.now(),
        name: 'Test Entry',
        email: 'test' + Date.now() + '@example.com',
        status: 'active'
    };

    console.log('Attempting insert...');
    const { data: insData, error: insErr } = await supabase
        .from('employees')
        .insert(dummy)
        .select();

    if (insErr) {
        console.error('Insert Error:', insErr.message);
        if (insErr.details) console.error('Details:', insErr.details);
    } else {
        console.log('Insert Success! ID:', insData[0]?.id);
        // Delete it immediately
        await supabase.from('employees').delete().eq('id', insData[0].id);
        console.log('Test entry cleaned up.');
    }
}

check();
