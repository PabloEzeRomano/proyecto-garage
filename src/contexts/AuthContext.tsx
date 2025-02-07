/**
 * Authentication context and provider for managing user authentication state
 * and role-based access control (RBAC) in the application.
 * @module AuthContext
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { useSupabase } from './SupabaseContext';
import { Role, Permission } from '@/types/database';

/**
 * Authentication context type definition
 * @interface AuthContextType
 */
interface AuthContextType {
  /** Current session object from Supabase */
  session: Session | null;
  /** Current user object from Supabase */
  user: User | null;
  /** Loading state for auth operations */
  loading: boolean;
  /** Check if user has a specific permission */
  hasPermission: (permission: Permission) => boolean;
  /** Check if user has any of the specified roles */
  hasRole: (roles: Role | Role[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication provider component that manages authentication state and provides
 * auth-related utilities through context.
 *
 * @component
 * @example
 * ```tsx
 * // Wrap your app with AuthProvider
 * function App() {
 *   return (
 *     <AuthProvider>
 *       <YourApp />
 *     </AuthProvider>
 *   );
 * }
 *
 * // Use auth utilities in your components
 * function ProtectedComponent() {
 *   const { user, hasRole, hasPermission } = useAuth();
 *
 *   if (!user) {
 *     return <div>Please log in</div>;
 *   }
 *
 *   if (hasRole(Role.ADMIN)) {
 *     return <div>Admin Panel</div>;
 *   }
 *
 *   if (hasPermission(Permission.ITEMS_CREATE)) {
 *     return <div>Create Item Form</div>;
 *   }
 *
 *   return <div>Regular User View</div>;
 * }
 * ```
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useSupabase();
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  /**
   * Check if the current user has a specific permission
   * @param permission - The permission to check for
   * @returns boolean indicating if the user has the permission
   */
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const userPermissions = (user.app_metadata.permissions as Permission[]) || [];
    return userPermissions.includes(permission);
  };

  /**
   * Check if the current user has any of the specified roles
   * @param roles - Single role or array of roles to check for
   * @returns boolean indicating if the user has any of the roles
   */
  const hasRole = (roles: Role | Role[]): boolean => {
    if (!user) return false;
    const userRoles = (user.app_metadata.roles as Role[]) || [];
    return Array.isArray(roles)
      ? roles.some((role) => userRoles.includes(role))
      : userRoles.includes(roles);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, hasPermission, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access authentication context and utilities
 *
 * @returns Authentication context containing session, user, loading state, and utility functions
 *
 * @example
 * ```tsx
 * function AdminPanel() {
 *   const { user, hasRole, loading } = useAuth();
 *
 *   if (loading) {
 *     return <div>Loading...</div>;
 *   }
 *
 *   if (!user || !hasRole(Role.ADMIN)) {
 *     return <div>Access Denied</div>;
 *   }
 *
 *   return <div>Admin Panel Content</div>;
 * }
 * ```
 *
 * @throws {Error} If used outside of AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}