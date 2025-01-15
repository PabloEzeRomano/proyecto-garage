import { createServerClient } from '@supabase/ssr';
import { serialize } from 'cookie';
import { type NextApiRequest, type NextApiResponse } from 'next';

export function createClient(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookies: { name: string; value: string }[] = [];
          for (const [name, value] of Object.entries(req.cookies)) {
            cookies.push({ name, value: value as string });
          }
          return cookies;
        },
        setAll: (cookies) => {
          res.setHeader('Set-Cookie', cookies.map(({ name, value, options }) => {
            return serialize(name, value, {
              ...options,
              sameSite: 'lax',
              httpOnly: true,
              path: '/'
            });
          }));
        },
      },
    }
  );
}