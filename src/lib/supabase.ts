import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabasePublishableKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    typeof supabaseUrl === 'string' &&
    supabaseUrl.startsWith('http') &&
    typeof supabasePublishableKey === 'string' &&
    supabasePublishableKey.length > 10
  );
};

// Safe client: If credentials are not set, use safe placeholders so React never throws an unhandled error
export const supabase = createClient(
  isSupabaseConfigured() ? supabaseUrl : 'https://placeholder-shadowbytes.supabase.co',
  isSupabaseConfigured() ? supabasePublishableKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder'
);
