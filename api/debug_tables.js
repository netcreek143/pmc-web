import supabase from './_supabase.js';

export default async function handler(req, res) {
    try {
        const { data, error } = await supabase.from('products').select('id').limit(1);
        const { data: catData, error: catError } = await supabase.from('categories').select('id').limit(1);
        const { data: empData, error: empError } = await supabase.from('employees').select('id').limit(1);

        return res.status(200).json({
            products: { exists: !error, error: error?.message },
            categories: { exists: !catError, error: catError?.message },
            employees: { exists: !empError, error: empError?.message },
            env: {
                schema: process.env.SUPABASE_DB_SCHEMA,
                url: process.env.NEXT_PUBLIC_SUPABASE_URL
            }
        });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}
