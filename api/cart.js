import supabase from './_supabase.js';

function getSessionId(req) {
  return req.headers['x-session-id'] || req.query.session_id || 'guest-001';
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Session-Id');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const session_id = getSessionId(req);
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'POST') {
      const session_id = getSessionId(req);
      const payload = { ...req.body, session_id };
      const { data, error } = await supabase.from('cart_items').insert(payload).select().single();
      if (error) throw error;
      return res.status(201).json(data);
    }
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;
      const { data, error } = await supabase.from('cart_items').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return res.status(200).json(data);
    }
    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('cart_items').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
}
