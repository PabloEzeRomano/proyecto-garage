import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { Role, Permission } from '@/types/database';

export default function useAuth(
  allowedRoles: Role[] = [],
  requiredPermissions: Permission[] = [],
  requireAuth: boolean = true
) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get initial session and user
    Promise.all([supabase.auth.getSession(), supabase.auth.getUser()]).then(
      ([
        {
          data: { session },
        },
        {
          data: { user },
        },
      ]) => {
        setSession(session);
        setUser(user);
        setLoading(false);
      }
    );

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loading) {
      return;
    }

    if (requireAuth && !session) {
      router.push('/auth/sign-in');
      return;
    }

    if (user) {
      const userRoles = (user.app_metadata?.roles as Role[]) || [];
      const userPermissions =
        (user.app_metadata?.permissions as Permission[]) || [];

      // Check roles
      if (allowedRoles.length > 0) {
        const hasRequiredRole = allowedRoles.some((role) =>
          userRoles.includes(role)
        );
        if (!hasRequiredRole) {
          router.push('/');
          return;
        }
      }

      // Check permissions
      if (requiredPermissions.length > 0) {
        const hasRequiredPermissions = requiredPermissions.every((permission) =>
          userPermissions.includes(permission)
        );
        if (!hasRequiredPermissions) {
          router.push('/');
          return;
        }
      }
    }
  }, [
    session,
    user,
    loading,
    requireAuth,
    allowedRoles,
    requiredPermissions,
    router,
  ]);

  const hasPermission = (permission: Permission) => {
    if (!user) return false;
    const userPermissions =
      (user.app_metadata.permissions as Permission[]) || [];
    return userPermissions.includes(permission);
  };

  const hasRole = (roles: Role | Role[]) => {
    if (!user) return false;
    const userRoles = (user.app_metadata.roles as Role[]) || [];
    return Array.isArray(roles)
      ? roles.some((role) => userRoles.includes(role))
      : userRoles.includes(roles);
  };

  return { session, user, loading, hasPermission, hasRole };
}
