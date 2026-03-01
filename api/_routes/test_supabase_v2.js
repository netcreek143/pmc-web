import supabase from '../_supabase.js';

export default async function handler(req, res) {
    try {
        const results = {};

        // 1. Check products
        const { count, error: pError } = await supabase.from('products').select('*', { count: 'exact', head: true });
        results.products = { count, error: pError?.message };

        // 2. Check employees
        const { error: eError } = await supabase.from('employees').select('id').limit(1);
        if (eError) {
            results.employees = { exists: false, error: eError.message };
        } else {
            results.employees = { exists: true };
        }

        // 3. Check env
        results.env = {
            url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            schema: process.env.SUPABASE_DB_SCHEMA,
            has_service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        };

        return res.status(200).json(results);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
