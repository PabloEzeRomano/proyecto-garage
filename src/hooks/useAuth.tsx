import { Role } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function useAuth(allowedRoles: Role[] = [], requireAuth: boolean = true) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (requireAuth && !session) {
      router.push('/auth/sign-in');
      return;
    }

    if (session?.user && allowedRoles.length > 0) {
      const hasRequiredRole = allowedRoles.includes(session.user.role as Role);
      if (!hasRequiredRole) {
        router.push('/');
      }
    }
  }, [session, status, requireAuth, allowedRoles, router]);

  const isAllowed = (roles: Role[]) => {
    if (!session?.user) return false;
    if (roles.length === 0) return true;
    return roles.includes(session.user.role as Role);
  };

  return { session, status, isAllowed };
}
