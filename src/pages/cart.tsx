import { useCart } from '@/contexts/CartContext';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

const CartPage = () => {
  const { cart, clearCart, cartItemCount } = useCart();

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black mb-8 sm:mb-12">
          Your Shopping Cart
        </h1>

        {cartItemCount === 0 ? (
          <div className="text-center py-16 sm:py-20 bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200">
            <ShoppingCartIcon className="h-20 sm:h-24 w-20 sm:w-24 text-gray-400 mx-auto mb-6 sm:mb-8" />
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-4">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-8">Add some products to get started!</p>
            <Link href="/products">
              <button className="bg-black text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg">
                Start Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-6">
              {cart.map((item) => (
                <CartItem key={`${item.id}-${item.size}`} item={item} />
              ))}
              <div className="mt-6 text-right">
                <button 
                  onClick={clearCart}
                  className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
                >
                  Clear Cart
                </button>
              </div>
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
