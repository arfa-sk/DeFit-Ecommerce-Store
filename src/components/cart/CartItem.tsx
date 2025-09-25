import Image from 'next/image';
import { CartItem as CartItemType } from '@/types';
import { useCart } from '@/contexts/CartContext';
import { formatCurrency } from '@/lib/helpers';
import Button from '@/components/ui/Button';
import { TrashIcon } from '@heroicons/react/24/outline';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 0) {
      updateQuantity(item.id, item.size, newQuantity);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start gap-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-black truncate">{item.name}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-600">
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-gray-100 text-gray-700">Size: {item.size}</span>
                <span className="inline-flex items-center px-2 py-1 rounded-lg bg-yellow-100 text-yellow-800 font-semibold">{formatCurrency(item.price)}</span>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item.id, item.size)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 self-start"
              aria-label="Remove item"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-14 sm:w-16 px-2 py-2 bg-white border border-gray-300 rounded-xl text-black text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              aria-label="Increase quantity"
            >
              +
            </button>
            <div className="ml-auto text-right">
              <p className="text-xs text-gray-500">Subtotal</p>
              <p className="text-base sm:text-lg font-black text-yellow-600">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
