import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Preference } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!,
  options: {
    integratorId: process.env.NEXT_PUBLIC_MP_INTEGRATOR_ID!
  }
});

const preference = new Preference(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { items } = req.body;

    const result = await preference.create({
      body: {
        purpose: 'wallet_purchase',
        items: items.map((item: any) => ({
          id: `item-${item.id}`,
          title: item.title,
          quantity: item.quantity,
          unit_price: Number(item.price),
          currency_id: 'ARS',
        })),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_BASE_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_BASE_URL}/pending`,
        },
        auto_return: 'approved',
      }
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Preference creation error:', error);
    return res.status(500).json({
      error: true,
      message: error.message
    });
  }
}