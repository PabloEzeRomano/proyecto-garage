import { Role } from '@prisma/client';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo } from 'react';

const useAuth = (allowedRoles: Role[] = [], requireAuth = true) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!session && requireAuth) {
      signIn();
    } else if (
      session &&
      allowedRoles.length &&
      !allowedRoles.includes(session.user.role)
    ) {
      router.push('/auth/sign-in');
    }
  }, [allowedRoles, router, session, status, requireAuth]);

  const isAllowed = useCallback(
    (roles: Role[]) => {
      if (!session) return false;
      return roles.includes(session.user.role);
    },
    [session]
  );

  const isAdmin = useMemo(() => {
    if (!session || !session.user) return false;
    return session.user.role === Role.ADMIN;
  }, [session]);

  return { session, status, isAllowed, isAdmin };
};

export default useAuth;
