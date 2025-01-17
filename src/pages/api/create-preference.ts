import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextApiRequest, NextApiResponse } from 'next';

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!,
  options: {
    integratorId: process.env.NEXT_PUBLIC_MP_INTEGRATOR_ID!
  }
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  console.log(body);

  if (method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  try {
    const { cartItems } = body;

    const preference = new Preference(client);
    const result = await preference.create({
      body: {
        items: cartItems.map((item: any) => ({
          title: item.name,
          quantity: item.quantity,
          unit_price: item.price,
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

    return res.status(201).json(result);
  } catch (error) {
    console.log('Error creating preference:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}