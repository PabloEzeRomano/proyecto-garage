import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase-server';

type UserMetadata = {
  name: string;
  role: 'USER' | 'ADMIN';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const supabase = createClient(req, res);

  try {
    // Get the current session for protected routes
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (method === 'GET') {
      const { data: items, error } = await supabase
        .from('items')
        .select('*');

      if (error) throw error;
      return res.status(200).json(items);
    }

    // All other methods require authentication and admin role
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userMetadata = session.user.user_metadata as UserMetadata;
    if (userMetadata.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (method === 'POST') {
      const { data: newItem, error } = await supabase
        .from('items')
        .insert([req.body])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(newItem);
    }

    if (method === 'PATCH') {
      const { id, ...updateData } = req.body;
      const { data: updatedItem, error } = await supabase
        .from('items')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(updatedItem);
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Item deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
