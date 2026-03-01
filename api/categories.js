import supabase from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'POST') {
            const { name, image_url } = req.body;
            const { data, error } = await supabase.from('categories').insert([{ name, image_url }]).select().single();
            if (error) throw error;
            return res.status(200).json(data);
        }

        if (req.method === 'DELETE') {
            const { id } = req.body;
            const { error } = await supabase.from('categories').delete().eq('id', id);
            if (error) {
                if (error.code === '23503') {
                    return res.status(400).json({ error: 'Cannot delete category: It has products linked to it. Please remove or reassign the products first.' });
                }
                throw error;
            }
            return res.status(200).json({ success: true });
        }

        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
