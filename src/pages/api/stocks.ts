import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  try {
    if (method === 'POST') {
      const newStock = await prisma.stock.create({ data: body });
      return res.status(201).json(newStock);
    }

    if (method === 'GET') {
      const stocks = await prisma.stock.findMany();
      return res.status(200).json(stocks);
    }

    if (method === 'PATCH') {
      const updatedStock = await prisma.stock.update({
        where: { id: body.id },
        data: body,
      });
      return res.status(200).json(updatedStock);
    }

    if (method === 'DELETE') {
      await prisma.stock.delete({ where: { id: body.id } });
      return res.status(200).json({ message: 'Stock deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
