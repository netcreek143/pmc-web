import supabase from './_supabase.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();

    // Helper: get pending product IDs from cms_content
    async function getPendingIds() {
        const { data } = await supabase
            .from('cms_content')
            .select('content')
            .eq('key', 'pending_products')
            .maybeSingle();
        if (data && data.content) {
            try {
                const parsed = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;
                return Array.isArray(parsed) ? parsed : [];
            } catch { return []; }
        }
        return [];
    }

    // Helper: save pending product IDs to cms_content
    async function savePendingIds(ids) {
        const { data: existing } = await supabase
            .from('cms_content')
            .select('id')
            .eq('key', 'pending_products')
            .maybeSingle();

        if (existing) {
            await supabase
                .from('cms_content')
                .update({ content: JSON.stringify(ids) })
                .eq('key', 'pending_products');
        } else {
            await supabase
                .from('cms_content')
                .insert({ key: 'pending_products', title: 'Pending Products', content: JSON.stringify(ids) });
        }
    }

    try {
        if (req.method === 'GET') {
            const { category, sort, status } = req.query;
            let query = supabase.from('products').select('*');
            if (category) {
                query = query.eq('category_id', Number(category));
            }
            if (sort === 'price_asc') {
                query = query.order('price', { ascending: true });
            } else if (sort === 'price_desc') {
                query = query.order('price', { ascending: false });
            } else {
                query = query.order('id', { ascending: false });
            }
            const { data, error } = await query;
            if (error) throw error;

            // Filter by status if requested
            if (status) {
                const pendingIds = await getPendingIds();
                if (status === 'pending') {
                    return res.status(200).json(data.filter(p => pendingIds.includes(p.id)));
                } else if (status === 'published') {
                    return res.status(200).json(data.filter(p => !pendingIds.includes(p.id)));
                }
            }

            return res.status(200).json(data);
        }
        if (req.method === 'POST') {
            const { status: productStatus, ...payload } = req.body;
            // Remove status from payload since column doesn't exist
            const { data, error } = await supabase.from('products').insert(payload).select().single();
            if (error) throw error;

            // If status is 'pending', add the ID to the pending list
            if (productStatus === 'pending') {
                const pendingIds = await getPendingIds();
                pendingIds.push(data.id);
                await savePendingIds(pendingIds);
            }

            return res.status(201).json(data);
        }
        if (req.method === 'PUT') {
            const { id, status: newStatus, ...updates } = req.body;

            // If we're just changing status (verify/publish), handle that
            if (newStatus === 'published') {
                const pendingIds = await getPendingIds();
                const updatedIds = pendingIds.filter(pid => pid !== id);
                await savePendingIds(updatedIds);
                // Also apply any other updates
                if (Object.keys(updates).length > 0) {
                    const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
                    if (error) throw error;
                    return res.status(200).json(data);
                }
                return res.status(200).json({ ok: true, id });
            }

            // Normal update (no status change)
            const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
            if (error) throw error;
            return res.status(200).json(data);
        }
        if (req.method === 'DELETE') {
            const { id } = req.body;
            // Also remove from pending list if present
            const pendingIds = await getPendingIds();
            if (pendingIds.includes(id)) {
                await savePendingIds(pendingIds.filter(pid => pid !== id));
            }
            const { error } = await supabase.from('products').delete().eq('id', id);
            if (error) throw error;
            return res.status(200).json({ ok: true });
        }
        res.status(405).json({ error: 'Method not allowed' });
    } catch (err) {
        console.error('API error:', err);
        res.status(500).json({ error: err.message });
    }
}
