import type { NextApiRequest, NextApiResponse } from 'next';
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
  accessToken: process.env.NEXT_PUBLIC_MP_ACCESS_TOKEN!,
});

const payment = new Payment(client);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;

    const result = await payment.create({
      body: {
        transaction_amount: Number(formData.transaction_amount),
        token: formData.token,
        description: formData.description,
        installments: Number(formData.installments),
        payment_method_id: formData.payment_method_id,
        payer: {
          email: formData.payer.email,
        },
      },
    });

    return res.status(200).json(result);
  } catch (error: any) {
    console.error('Payment error:', error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
}
