import { createServerSupabaseClient } from '@/lib/supabase-server';
import { Role } from '@/types/database';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * API handler for database mutations (create, update, delete)
 * Requires authentication and admin privileges
 *
 * @param req NextApiRequest with:
 *   - query.table: The table to perform the operation on
 *   - body.operation: 'create' | 'update' | 'delete'
 *   - body.id: Record ID (for update/delete)
 *   - body.data: Record data (for create/update)
 * @param res NextApiResponse
 *
 * @returns
 * - 200: Operation successful
 * - 201: Create operation successful
 * - 400: Invalid operation
 * - 401: Unauthorized (not authenticated)
 * - 403: Forbidden (not admin)
 * - 500: Server error
 *
 * @example
 * // Create
 * POST /api/mutations/items
 * { "operation": "create", "data": { "title": "New Item" } }
 *
 * // Update
 * POST /api/mutations/items
 * { "operation": "update", "id": "123", "data": { "title": "Updated" } }
 *
 * // Delete
 * POST /api/mutations/items
 * { "operation": "delete", "id": "123" }
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { table } = req.query;
  const { operation, id, data } = req.body;

  const supabase = createServerSupabaseClient({ req, res });

  try {
    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user has admin role
    const userRoles = user.app_metadata.roles as Role[];
    if (!userRoles?.includes(Role.ADMIN) && !userRoles?.includes(Role.ROOT)) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    switch (operation) {
      case 'delete':
        const { error: deleteError } = await supabase
          .from(table as string)
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;
        return res.status(200).json({ success: true });

      case 'update':
        const { data: updated, error: updateError } = await supabase
          .from(table as string)
          .update(data)
          .eq('id', id)
          .select()
          .single();

        if (updateError) throw updateError;
        return res.status(200).json({ data: updated });

      case 'create':
        const { data: created, error: createError } = await supabase
          .from(table as string)
          .insert(data)
          .select()
          .single();

        if (createError) throw createError;
        return res.status(201).json({ data: created });

      default:
        return res.status(400).json({ error: 'Invalid operation' });
    }
  } catch (error) {
    console.error(`Error in ${table} mutation:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
