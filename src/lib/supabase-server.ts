import { createServerClient } from '@supabase/ssr';
import type { GetServerSidePropsContext } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

// Regular server-side client (for API routes and getServerSideProps)
export const createServerSupabaseClient = (context: GetServerSidePropsContext) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (key) => {
          return context.req.cookies[key];
        },
        set: (key, value, options) => {
          context.res.setHeader('Set-Cookie', `${key}=${value}; Path=/; HttpOnly; SameSite=Lax`);
        },
        remove: (key, _options) => {
          context.res.setHeader('Set-Cookie', `${key}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
        },
      }
    }
  );
};

// Admin client with service role (for privileged operations)
export function createServerSupabaseAdmin() {
  if (!supabaseServiceKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(
    supabaseUrl,
    supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}