import { useRouter } from 'next/router';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const OrderConfirmationPage = () => {
  const router = useRouter();
  const { id } = router.query;

  if (!id) {
    return (
      <div className="text-center py-16 bg-surface rounded-xl shadow-lg border border-border">
        <p className="text-2xl text-textSecondary mb-4">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8">
      <div className="bg-surface p-10 rounded-xl shadow-lg border border-border text-center max-w-2xl w-full">
        <CheckCircleIcon className="h-24 w-24 text-success mx-auto mb-6 animate-scale-in" />
        <h1 className="text-5xl font-bold font-serif text-text mb-4 animate-fade-in-up">Order Confirmed!</h1>
        <p className="text-xl text-textSecondary mb-6 animate-fade-in-up delay-100">
          Thank you for your purchase from DeFit.
        </p>
        <p className="text-2xl font-semibold text-primary mb-8 animate-fade-in-up delay-200">
          Your Order ID: <span className="font-mono bg-background px-3 py-1 rounded-md">{id.toString().slice(0, 8).toUpperCase()}</span>
        </p>
        <p className="text-lg text-textSecondary mb-8 animate-fade-in-up delay-300">
          You will receive an email confirmation shortly with your order details.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up delay-400">
          <Link href="/products">
            <Button variant="primary" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href={`/track-order/${id}`}>
            <Button variant="outline" size="lg">
              Track Your Order
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
