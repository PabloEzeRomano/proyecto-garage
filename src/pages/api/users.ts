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
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if user is authenticated for protected routes
    if (method !== 'POST' && !session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (method === 'GET') {
      const { data: users, error } = await supabase
        .from('users')
        .select('id, email, raw_user_meta_data');

      if (error) throw error;

      return res.status(200).json(users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.raw_user_meta_data.name,
        role: user.raw_user_meta_data.role,
      })));
    }

    if (method === 'PATCH') {
      const { id, name, role } = req.body;
      const userMetadata = session?.user.user_metadata as UserMetadata;

      // Check if user is updating their own profile or is an admin
      if (session?.user.id !== id && userMetadata.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // If user is not an admin, they can only update their name
      const updateData = userMetadata.role === 'ADMIN'
        ? { name, role }
        : { name };

      const { data: user, error } = await supabase.auth.admin.updateUserById(
        id,
        {
          user_metadata: updateData,
        }
      );

      if (error) throw error;
      return res.status(200).json(user);
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      const userMetadata = session?.user.user_metadata as UserMetadata;

      // Only admins can delete users
      if (userMetadata.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const { error } = await supabase.auth.admin.deleteUser(id);

      if (error) throw error;
      return res.status(200).json({ message: 'User deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
