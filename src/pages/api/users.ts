import { prisma } from '@/lib/prisma';
import { getSession } from 'next-auth/react';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { method, body } = req;

  try {
    if (method === 'POST') {
      const { name, email, password } = body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const { password: _, ...restUser } = await prisma.user.create({
        data: { name, email, password: hashedPassword },
      });
      return res.status(201).json(restUser);
    }

    if (method === 'GET') {
      const users = await prisma.user.findMany();
      return res.status(200).json(users.map(({ password, ...restUser }) => restUser));
    }

    if (method === 'PATCH') {
      const { id, ...updateData } = body;

      // Check if the user is updating their own profile or if they're an admin
      if (session.user.id !== id && session.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Forbidden' });
      }

      // If the user is not an admin, remove the role from updateData
      if (session.user.role !== 'ADMIN') {
        delete updateData.role;
      }

      const { password: _, ...updatedUser } = await prisma.user.update({
        where: { id },
        data: updateData,
      });
      return res.status(200).json(updatedUser);
    }

    if (method === 'DELETE') {
      await prisma.user.delete({ where: { id: body.id } });
      return res.status(200).json({ message: 'User deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
