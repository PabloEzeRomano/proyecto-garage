import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Types for our global singleton
declare global {
  var supabaseInstance: ReturnType<typeof createBrowserClient<Database>> | undefined;
  var supabaseAdminInstance: ReturnType<typeof createClient<Database>> | undefined;
}

// Debug function to get the current component stack
const getDebugStack = () => {
  const stack = new Error().stack;
  console.log('Supabase client initialization stack:', stack);
};

// Browser client singleton
export const supabase = global.supabaseInstance || (() => {
  if (typeof window === 'undefined') {
    // Server-side: create a new instance every time
    return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  // Client-side: create once and reuse
  if (!global.supabaseInstance) {
    global.supabaseInstance = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return global.supabaseInstance;
})();

// Admin client singleton for server-side operations
export const supabaseAdmin = global.supabaseAdminInstance || (() => {
  if (!supabaseServiceRoleKey) return null;

  if (typeof window === 'undefined') {
    // Server-side: create a new instance every time
    return createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }

  // Client-side: create once and reuse
  if (!global.supabaseAdminInstance) {
    global.supabaseAdminInstance = createClient<Database>(
      supabaseUrl,
      supabaseServiceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return global.supabaseAdminInstance;
})();