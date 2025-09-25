import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertValidPublicClient() {
  if (!supabaseUrl) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_URL');
  }
  if (!/^https?:\/\//i.test(supabaseUrl)) {
    throw new Error('Invalid env NEXT_PUBLIC_SUPABASE_URL: must start with http(s)://');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing env: NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }
}

assertValidPublicClient();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// For server-side/admin operations that require bypassing RLS
export const createAdminClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error('Missing env: SUPABASE_SERVICE_ROLE_KEY');
  }
  // Validate URL again in case module cache changed between builds/runs
  if (!supabaseUrl || !/^https?:\/\//i.test(supabaseUrl)) {
    throw new Error('Invalid or missing NEXT_PUBLIC_SUPABASE_URL for admin client');
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
    },
  });
};
