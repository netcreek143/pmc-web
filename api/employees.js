import crypto from 'crypto';
import supabase from './_supabase.js';

function hashPassword(password) {
    const salt = crypto.randomBytes(32);
    const key = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha256');
    return `${salt.toString('hex')}:${key.toString('hex')}`;
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('employees').select('*');
            if (error) {
                console.error('[API Employees] GET ERROR:', error.message);
                throw error;
            }
            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            console.log('[API Employees] POST payload:', JSON.stringify(req.body));
            const { password, ...body } = req.body;
            const payload = { ...body };
            if (password) payload.password_hash = hashPassword(password);

            // Clean up empty strings to null for optional fields
            Object.keys(payload).forEach(key => {
                if (payload[key] === '') payload[key] = null;
            });

            const { data, error } = await supabase.from('employees').insert(payload).select().single();
            if (error) throw error;
            return res.status(201).json(data);
        }
        if (req.method === 'PUT') {
            const { id, password, ...body } = req.body;
            const updates = { ...body };
            if (password) updates.password_hash = hashPassword(password);

            // Clean up empty strings to null
            Object.keys(updates).forEach(key => {
                if (updates[key] === '') updates[key] = null;
            });

            const { data, error } = await supabase.from('employees').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return res.status(200).json(data);
        }
        if (req.method === 'DELETE') {
            const { id } = req.body;
            const { error } = await supabase.from('employees').delete().eq('id', id);
            if (error) throw error;
            return res.status(200).json({ message: 'Deleted' });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
