import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, body } = req;

  try {
    if (method === 'POST') {
      const newItem = await prisma.item.create({ data: body });
      return res.status(201).json(newItem);
    }

    if (method === 'GET') {
      const items = await prisma.item.findMany();
      return res.status(200).json(items);
    }

    if (method === 'PATCH') {
      const updatedItem = await prisma.item.update({
        where: { id: body.id },
        data: body,
      });
      return res.status(200).json(updatedItem);
    }

    if (method === 'DELETE') {
      await prisma.item.delete({ where: { id: body.id } });
      return res.status(200).json({ message: 'Item deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
