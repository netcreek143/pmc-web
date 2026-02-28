const fs = require('fs');
const crypto = require('crypto');
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
for (const line of envFile.split('\n')) {
    if (line.trim() && !line.startsWith('#')) {
        const [key, ...val] = line.split('=');
        if (key) envVars[key.trim()] = val.join('=').replace(/^"/, '').replace(/"$/, '').trim();
    }
}
const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];
const schema = envVars['SUPABASE_DB_SCHEMA'] || 'public';

(async () => {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey, {
        db: { schema: schema },
        auth: { persistSession: false }
    });
    const hash = crypto.pbkdf2Sync('admin123', 'salt123', 1000, 64, 'sha512').toString('hex');
    const { error } = await supabase.from('auth_users').insert({ email: 'admin@packmycake.in', password_hash: hash, role: 'admin' });
    console.log('Seeding result:', error || 'Success');
})();
