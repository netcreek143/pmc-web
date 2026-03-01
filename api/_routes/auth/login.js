import crypto from 'crypto';
import supabase from '../_supabase.js';

function verifyPassword(password, storedHash) {
    const [saltHex, keyHex] = storedHash.split(':');
    const salt = Buffer.from(saltHex, 'hex');
    const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
    return key.toString('hex') === keyHex;
}

function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method !== 'POST') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        const { email, password } = req.body;

        // Try finding in auth_users first (Main Admins/Customers)
        let { data: user, error } = await supabase
            .from('auth_users')
            .select('id, email, password_hash, role')
            .eq('email', email)
            .single();

        let isEmployee = false;

        // If not found, try employees table (Staff)
        if (error || !user) {
            // Check email first
            let { data: emp, error: empError } = await supabase
                .from('employees')
                .select('id, email, username, password_hash, permissions')
                .eq('email', email)
                .single();

            // If not found by email, try username
            if (empError || !emp) {
                const { data: empByUser, error: userError } = await supabase
                    .from('employees')
                    .select('id, email, username, password_hash, permissions')
                    .eq('username', email) // 'email' variable contains whatever the user typed in the first field
                    .single();

                if (userError || !empByUser) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }
                emp = empByUser;
            }

            user = { ...emp, role: 'employee' };
            isEmployee = true;
        }

        const valid = verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

        // Only create session in auth_sessions if it's a main auth_user
        // For employees, we'll just return the token for now or we could add a user_id to auth_sessions
        if (!isEmployee) {
            const { error: sessionError } = await supabase
                .from('auth_sessions')
                .insert({ id: token, user_id: user.id, expires_at });
            if (sessionError) throw sessionError;
        }

        return res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                permissions: user.permissions || []
            },
            token
        });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
