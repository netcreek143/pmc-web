import supabase from './_supabase.js';

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
                .eq('key', 'company_details')
                .maybeSingle();

            if (error) throw error;

            if (!data) return res.status(200).json({});

            let parsed = {};
            try {
                parsed = JSON.parse(data.content);
            } catch (e) {
                // Ignore parse errors
            }

            return res.status(200).json({
                company_name: data.title,
                logo_url: data.image_url,
                ...parsed
            });
        }

        if (req.method === 'PUT' || req.method === 'POST') {
            const payload = req.body;
            const { company_name, logo_url, ...rest } = payload;

            // Check if exists to get ID for upsert, or just use upsert with key constraint if it exists.
            // If there's no unique constraint on key, we must fetch id first.
            const { data: existing } = await supabase
                .from('cms_content')
                .select('id')
                .eq('key', 'company_details')
                .maybeSingle();

            const record = {
                key: 'company_details',
                title: company_name || 'Pack My Cake',
                image_url: logo_url || '',
                content: JSON.stringify(rest)
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

            return res.status(200).json({
                company_name: data.title,
                logo_url: data.image_url,
                ...parsed
            });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
