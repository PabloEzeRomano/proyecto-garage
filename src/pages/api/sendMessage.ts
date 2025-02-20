import { NextApiRequest, NextApiResponse } from 'next';
import * as wppconnect from '@wppconnect-team/wppconnect';

let client: any = null;

async function initializeClient() {
  if (!client) {
    try {
      client = await wppconnect.create({
        session: 'whatsapp-session',
        catchQR: (base64Qr, asciiQR) => {
          // You can emit this QR code to your frontend if needed
          console.log('QR Code received', asciiQR);
        },
        statusFind: (statusSession, session) => {
          console.log('Status Session:', statusSession);
          console.log('Session name:', session);
        },
      });

      await client.waitForQrCodeScan();
      console.log('Client is ready!');
    } catch (error) {
      console.error('Error initializing WhatsApp client:', error);
      throw error;
    }
  }
  return client;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { phoneNumber, message } = body;

    if (!phoneNumber || !message) {
      return res.status(400).json({
        error: 'Phone number and message are required',
      });
    }

    const whatsappClient = await initializeClient();

    // Format phone number (remove any non-numeric characters)
    const formattedPhone = phoneNumber.replace(/\D/g, '');

    // Send the message
    const result = await whatsappClient.sendText(
      `${formattedPhone}@c.us`,
      message
    );

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      result,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({
      error: 'Error sending WhatsApp message',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

// Configure the body size limit for file uploads if needed
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
  },
};
