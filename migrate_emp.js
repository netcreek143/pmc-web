import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

function hashPassword(password) {
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
    return `${salt.toString('hex')}:${key.toString('hex')}`;
}

async function run() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const password = 'suriya@1A';
    const hashed = hashPassword(password);

    console.log('Updating password for suriya...');
    const { data, error } = await supabase
        .from('employees')
        .update({ password_hash: hashed })
        .eq('username', 'suriya')
        .select();

    if (error) {
        console.error('Update failed:', error.message);
    } else {
        console.log('Update success!', JSON.stringify(data));
    }
}

run();
