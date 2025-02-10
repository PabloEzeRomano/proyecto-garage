import { useState } from 'react';
import { createServerSupabaseAdmin } from '@/lib/supabase-server';
import { Role } from '@/types/database';
import { User, UserResponse } from '@supabase/supabase-js';

interface AuthMutationOptions {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

interface UserUpdateData {
  email?: string;
  user_metadata?: { name: string };
  app_metadata?: { roles: Role[] };
}

interface UserCreateData extends UserUpdateData {
  email: string;
  password: string;
}

/**
 * Hook for handling Supabase Auth admin operations
 * @returns Object containing auth operations and state
 *
 * @example
 * const { updateUser, createUser, deleteUser, loading, error } = useAuthMutations();
 *
 * // Update user
 * await updateUser(userId, {
 *   email: 'new@email.com',
 *   user_metadata: { name: 'New Name' },
 *   app_metadata: { roles: [Role.USER] }
 * });
 *
 * // Create user
 * await createUser({
 *   email: 'new@user.com',
 *   password: 'securepass',
 *   user_metadata: { name: 'New User' },
 *   app_metadata: { roles: [Role.USER] }
 * });
 */
export const useAuthMutations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performAuthOperation = async <T extends UserResponse>(
    operation: () => Promise<T>,
    options?: AuthMutationOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const supabaseAdmin = createServerSupabaseAdmin();
      if (!supabaseAdmin) {
        throw new Error('Admin client not available');
      }

      const result = await operation();
      if (result.error) throw result.error;

      options?.onSuccess?.();
      return result.data.user;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (
    userId: string,
    data: UserUpdateData,
    options?: AuthMutationOptions
  ) => {
    return performAuthOperation(
      () => createServerSupabaseAdmin()!.auth.admin.updateUserById(userId, data),
      options
    );
  };

  const createUser = async (
    data: UserCreateData,
    options?: AuthMutationOptions
  ) => {
    return performAuthOperation(
      () => createServerSupabaseAdmin()!.auth.admin.createUser(data),
      options
    );
  };

  const deleteUser = async (
    userId: string,
    options?: AuthMutationOptions
  ) => {
    return performAuthOperation(
      () => createServerSupabaseAdmin()!.auth.admin.deleteUser(userId),
      options
    );
  };

  return {
    updateUser,
    createUser,
    deleteUser,
    loading,
    error,
  };
};