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
        const { data: user, error } = await supabase
            .from('auth_users')
            .select('id, email, password_hash')
            .eq('email', email)
            .single();
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const valid = verifyPassword(password, user.password_hash);
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { error: sessionError } = await supabase
            .from('auth_sessions')
            .insert({ id: token, user_id: user.id, expires_at });
        if (sessionError) throw sessionError;

        return res.status(200).json({ user: { id: user.id, email: user.email }, token });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
