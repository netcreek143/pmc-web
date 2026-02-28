import supabase from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { product_id } = req.query;
            let query = supabase.from('bulk_pricing').select('*').order('min_qty', { ascending: true });
            if (product_id) query = query.eq('product_id', Number(product_id));
            const { data, error } = await query;
            if (error) throw error;
            return res.status(200).json(data);
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
