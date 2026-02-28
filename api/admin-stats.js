import supabase from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method !== 'GET') {
            return res.status(405).json({ error: 'Method not allowed' });
        }
        const [{ data: orders }, { data: products }] = await Promise.all([
            supabase.from('orders').select('*'),
            supabase.from('products').select('*'),
        ]);
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const lowStock = products.filter((product) => product.stock <= product.low_stock_threshold).length;
        return res.status(200).json({
            totalRevenue,
            ordersToday: orders.filter((order) => order.status === 'Processing').length,
            productCount: products.length,
            lowStock,
        });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
