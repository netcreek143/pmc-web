import { createClient } from '@supabase/supabase-js';

// Fallback to hardcoded keys if VITE_ keys aren't set since this project uses NEXT_PUBLIC_ prefixes in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qoeqwtjjyilzcyliwdkh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvZXF3dGpqeWlsemN5bGl3ZGtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMTgxNDUsImV4cCI6MjA4Nzc5NDE0NX0.FkeOnFaKN26dFl4spqyFIVWDztuPWl0Rlr7FRhrL1E4';

export const supabase = createClient(supabaseUrl, supabaseKey);
