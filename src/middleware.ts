import { Role } from '@/types/database';
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/edit-user', '/add-item', '/add-stock', '/add-event'];
const adminRoutes = ['/edit-user', '/add-item', '/add-stock', '/add-event'];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => Array.from(request.cookies.getAll()).map(cookie => ({
          name: cookie.name,
          value: cookie.value,
        })),
        setAll: (cookies) => {
          cookies.forEach(cookie => {
            response.cookies.set({
              name: cookie.name,
              value: cookie.value,
              ...cookie.options,
            });
          });
        }
      },
    }
  );

  // Get authenticated user data
  const { data: { user }, error } = await supabase.auth.getUser();

  // Check if the route is protected
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
    if (!user) {
      const redirectUrl = new URL('/auth/sign-in', request.url);
      redirectUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check admin routes
    if (adminRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
      const userRoles = user.app_metadata?.roles as Role[];
      if (!userRoles?.includes(Role.ADMIN)) {
        console.log('User is not admin, redirecting from:', request.nextUrl.pathname);
        return NextResponse.redirect(new URL('/', request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|auth/sign-in|auth/sign-up).*)',
  ],
};
