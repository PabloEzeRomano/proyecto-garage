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

    if (method === 'GET') {
      const { data: events, error } = await supabase
        .from('events')
        .select('*');

      if (error) throw error;
      return res.status(200).json(events);
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
      const eventData = { ...req.body, date: new Date(req.body.date).toISOString() };
      const { data: newEvent, error } = await supabase
        .from('events')
        .insert([eventData])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(newEvent);
    }

    if (method === 'PATCH') {
      const { id, ...updateData } = req.body;
      if (updateData.date) {
        updateData.date = new Date(updateData.date).toISOString();
      }

      const { data: updatedEvent, error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(updatedEvent);
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
