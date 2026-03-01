import supabase from '../_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    try {
        if (req.method === 'GET') {
            const { data, error } = await supabase
                .from('cms_content')
                .select('*')
                .eq('key', 'invoice_settings')
                .maybeSingle();

            if (error) throw error;

            if (!data) return res.status(200).json({});

            let parsed = {};
            try {
                parsed = JSON.parse(data.content);
            } catch (e) {
                // Ignore parse errors
            }

            return res.status(200).json(parsed);
        }

        if (req.method === 'PUT' || req.method === 'POST') {
            const payload = req.body;

            const { data: existing } = await supabase
                .from('cms_content')
                .select('id')
                .eq('key', 'invoice_settings')
                .maybeSingle();

            const record = {
                key: 'invoice_settings',
                title: 'Invoice Settings',
                content: JSON.stringify(payload)
            };

            if (existing && existing.id) {
                record.id = existing.id;
            }

            const { data, error } = await supabase
                .from('cms_content')
                .upsert(record)
                .select()
                .single();

            if (error) throw error;

            let parsed = {};
            try {
                parsed = JSON.parse(data.content);
            } catch (e) { }

            return res.status(200).json(parsed);
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
