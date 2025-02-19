import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import { Payment } from '@mercadopago/sdk-react';
import { Spinner } from '@/components/Spinner';

export default function CheckoutPage() {
  const router = useRouter();
  const { getItemsWithDetails } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [preferenceId, setPreferenceId] = useState<string | null>(null);
  // const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const loadCartDetails = async () => {
      try {
        const cartItems = await getItemsWithDetails();
        // setItems(cartItems);

        const totalAmount = cartItems.reduce(
          (sum, item) => sum + (item.price || 0) * item.quantity,
          0
        );
        setTotal(totalAmount);

        // Create preference
        const response = await fetch('/api/create-preference', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ items: cartItems }),
        });

        const result = await response.json();
        if (result.error) {
          throw new Error(result.message);
        }

        setPreferenceId(result.id);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load cart details');
        setIsLoading(false);
      }
    };

    loadCartDetails();
  }, [getItemsWithDetails]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push('/cart')}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <p className="text-lg">
          Total to pay: <span className="font-bold">${total.toFixed(2)}</span>
        </p>
      </div>

      {preferenceId && (
        <div id="paymentBrick_container">
          <Payment
            initialization={{
              amount: total,
              preferenceId: preferenceId
            }}
            customization={{
              paymentMethods: {
                ticket: "all",
                creditCard: "all",
                debitCard: "all",
                mercadoPago: "all"
              },
            }}
            onSubmit={async ({ selectedPaymentMethod, formData }) => {
              try {
                const response = await fetch('/api/process-payment', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ formData }),
                });

                const result = await response.json();

                if (result.error) {
                  throw new Error(result.message);
                }

                // Handle successful payment
                router.push('/success');
              } catch (error: any) {
                console.error('Payment error:', error);
                setError(error.message);
              }
            }}
            onError={(error) => {
              console.error('Brick error:', error);
              setError('An error occurred while processing your payment');
            }}
          />
        </div>
      )}
    </div>
  );
}