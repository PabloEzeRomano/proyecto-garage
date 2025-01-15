import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/lib/supabase-server';

type UserMetadata = {
  name: string;
  role: 'USER' | 'ADMIN';
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const supabase = createClient(req, res);

  try {
    // Get the current session for protected routes
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // All methods require authentication and admin role
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userMetadata = session.user.user_metadata as UserMetadata;
    if (userMetadata.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    if (method === 'GET') {
      const { data: stocks, error } = await supabase
        .from('stock')
        .select('*, item:items(*)');

      if (error) throw error;
      return res.status(200).json(stocks);
    }

    if (method === 'POST') {
      const { data: newStock, error } = await supabase
        .from('stock')
        .insert([req.body])
        .select('*, item:items(*)')
        .single();

      if (error) throw error;
      return res.status(201).json(newStock);
    }

    if (method === 'PATCH') {
      const { id, ...updateData } = req.body;
      const { data: updatedStock, error } = await supabase
        .from('stock')
        .update(updateData)
        .eq('id', id)
        .select('*, item:items(*)')
        .single();

      if (error) throw error;
      return res.status(200).json(updatedStock);
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('stock')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Stock deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
