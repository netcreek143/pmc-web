import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

async function check() {
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Get products
    const { data: products, error: prodErr } = await supabase.from('products').select('id, name, price, sale_price');
    console.log('--- PRODUCTS ---');
    console.log(JSON.stringify(products, null, 2));

    // Get pending products from cms_content
    const { data: pending, error: pendErr } = await supabase
        .from('cms_content')
        .select('*')
        .eq('key', 'pending_products')
        .maybeSingle();

    console.log('--- PENDING PRODUCTS CONFIG ---');
    console.log(JSON.stringify(pending, null, 2));
}

check();
