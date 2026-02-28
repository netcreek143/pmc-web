import supabase from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { customer_email } = req.query;
            let query = supabase.from('wishlist_items').select('*').order('created_at', { ascending: false });
            if (customer_email) query = query.eq('customer_email', customer_email);
            const { data, error } = await query;
            if (error) throw error;
            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            const payload = req.body;
            const { data, error } = await supabase.from('wishlist_items').insert(payload).select().single();
            if (error) throw error;
            return res.status(201).json(data);
        }
        if (req.method === 'DELETE') {
            const { id } = req.body;
            const { error } = await supabase.from('wishlist_items').delete().eq('id', id);
            if (error) throw error;
            return res.status(200).json({ ok: true });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
