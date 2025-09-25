import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/helpers';
import Button from '@/components/ui/Button';
import Link from 'next/link';

const CartSummary = () => {
  const { cartTotal, cartItemCount } = useCart();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 sticky top-8">
      <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between text-gray-600 text-lg">
          <span>Items ({cartItemCount})</span>
          <span>{formatCurrency(cartTotal)}</span>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-black font-black text-xl sm:text-2xl">
            <span>Total</span>
            <span className="text-yellow-500">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
      </div>
      <Link href="/checkout">
        <button 
          className="w-full mt-6 sm:mt-8 py-4 bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
          disabled={cartItemCount === 0}
        >
          Proceed to Checkout
        </button>
      </Link>
    </div>
  );
};

export default CartSummary;
