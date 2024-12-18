import { NextApiRequest, NextApiResponse } from 'next';
import { sendTextMessage, sendTemplateMessage } from '@/lib/whatsapp';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { to, message, template, components } = req.body;

    let response;
    if (template) {
      response = await sendTemplateMessage(to, template, 'en', components);
    } else {
      response = await sendTextMessage(to, message);
    }

    return res.status(200).json(response);
  } catch (error) {
    console.error('WhatsApp API error:', error);
    return res.status(500).json({
      message: 'Error sending WhatsApp message',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}