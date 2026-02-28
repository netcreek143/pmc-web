import crypto from 'crypto';
import supabase from '../_supabase.js';

function hashPassword(password) {
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
    return `${salt.toString('hex')}:${key.toString('hex')}`;
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
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        const password_hash = hashPassword(password);
        const { data, error } = await supabase
            .from('auth_users')
            .insert({ email, password_hash })
            .select()
            .single();
        if (error) throw error;

        const token = generateToken();
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        const { error: sessionError } = await supabase
            .from('auth_sessions')
            .insert({ id: token, user_id: data.id, expires_at });
        if (sessionError) throw sessionError;

        return res.status(201).json({ user: { id: data.id, email: data.email }, token });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
