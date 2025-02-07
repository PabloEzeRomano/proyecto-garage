import { createServerClient } from '@supabase/ssr';
import type { GetServerSidePropsContext } from 'next';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { NextApiRequest, NextApiResponse } from 'next';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

type ContextType =
  | { req: NextApiRequest; res: NextApiResponse }
  | GetServerSidePropsContext;

// Unified server-side client for both API routes and getServerSideProps
export const createServerSupabaseClient = (context: ContextType) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          return Object.entries(context.req.cookies).map(([name, value]) => ({
            name,
            value: value ?? '',
          }));
        },
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) => {
            context.res.setHeader('Set-Cookie', `${name}=${value}; Path=/; HttpOnly; SameSite=Lax`);
          });
        }
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