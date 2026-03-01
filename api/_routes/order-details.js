import supabase from '../_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { order_id } = req.query;
            if (!order_id) return res.status(400).json({ error: 'order_id required' });

            // Fetch order items joined with products
            const { data: items, error: itemsError } = await supabase
                .from('order_items')
                .select('*, products(name)')
                .eq('order_id', order_id);
            if (itemsError) throw itemsError;

            // Fetch order address
            const { data: address, error: addressError } = await supabase
                .from('order_addresses')
                .select('*')
                .eq('order_id', order_id)
                .maybeSingle();

            return res.status(200).json({ items, address });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
