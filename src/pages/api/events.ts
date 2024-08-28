import { prisma } from '@/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  try {
    if (method === 'POST') {
      const newEvent = await prisma.event.create({
        data: { ...body, date: new Date(body.date) },
      });
      return res.status(201).json(newEvent);
    }

    if (method === 'PATCH') {
      const updatedEvent = await prisma.event.update({
        where: { id: body.id },
        data: { ...body, date: new Date(body.date) },
      });
      return res.status(200).json(updatedEvent);
    }

    if (method === 'GET') {
      const events = await prisma.event.findMany();
      return res.status(200).json(events);
    }

    if (method === 'DELETE') {
      await prisma.event.delete({ where: { id: body.id } });
      return res.status(200).json({ message: 'Event deleted successfully' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PATCH', 'DELETE']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
