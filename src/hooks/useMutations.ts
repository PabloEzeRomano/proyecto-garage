import { useState } from 'react';

/**
 * Options for mutation operations
 */
interface MutationOptions {
  /** Callback function to execute on successful mutation */
  onSuccess?: () => void;
  /** Callback function to execute on mutation error */
  onError?: (error: any) => void;
}

/**
 * Hook for handling CRUD operations with Supabase tables
 * @param table The name of the Supabase table to operate on
 * @returns Object containing CRUD operations and state
 *
 * @example
 * // Basic usage
 * const { create, update, delete, loading, error } = useMutations('items');
 *
 * // Create operation
 * await create(newItem, {
 *   onSuccess: () => console.log('Item created'),
 *   onError: (error) => console.error(error)
 * });
 *
 * // Update operation
 * await update(itemId, updatedData, {
 *   onSuccess: () => console.log('Item updated')
 * });
 *
 * // Delete operation
 * await delete(itemId, {
 *   onSuccess: () => console.log('Item deleted')
 * });
 */
export const useMutations = (table: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Internal mutation handler
   * @param operation The type of operation to perform
   * @param param1 Object containing id and data for the operation
   * @param options Success and error callbacks
   */
  const mutate = async (
    operation: 'create' | 'update' | 'delete',
    { id, data }: { id?: string; data?: any },
    options?: MutationOptions
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/mutations/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          operation,
          id,
          data,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Operation failed');
      }

      options?.onSuccess?.();
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    create: (data: any, options?: MutationOptions) =>
      mutate('create', { data }, options),
    update: (id: string, data: any, options?: MutationOptions) =>
      mutate('update', { id, data }, options),
    delete: (id: string, options?: MutationOptions) =>
      mutate('delete', { id }, options),
    loading,
    error,
  };
}