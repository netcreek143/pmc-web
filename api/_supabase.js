import { createClient } from '@supabase/supabase-js';

let _client = null;

function createSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const schema = process.env.SUPABASE_DB_SCHEMA;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Must pass both apikey (anon key) and Authorization (service role key)
    // so PostgREST can load the custom schema cache and authorize the request.
    return createClient(url, anonKey, {
        db: { schema },
        global: {
            headers: {
                apikey: anonKey,
                Authorization: `Bearer ${serviceKey}`,
            },
        },
    });
}

// Use a Proxy so the client is only created when first accessed,
// ensuring env vars are available (set at process startup) at that point.
const supabase = new Proxy({}, {
    get(_, prop) {
        if (!_client) {
            _client = createSupabaseClient();
        }
        const val = _client[prop];
        return typeof val === 'function' ? val.bind(_client) : val;
    }
});

export default supabase;
