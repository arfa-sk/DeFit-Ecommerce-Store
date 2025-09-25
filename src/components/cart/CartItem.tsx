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
    <div className="flex items-center bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 mr-4 sm:mr-6 flex-shrink-0 rounded-xl overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="96px"
          className="object-cover"
        />
      </div>
      <div className="flex-grow min-w-0">
        <h3 className="text-lg sm:text-xl font-bold text-black truncate">{item.name}</h3>
        <p className="text-gray-600 text-sm sm:text-base">Size: {item.size}</p>
        <p className="text-yellow-500 font-black text-lg sm:text-xl mt-1">{formatCurrency(item.price)}</p>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-4 ml-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            −
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-16 p-2 bg-white border border-gray-300 rounded-lg text-black text-center focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <button
            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors duration-200"
          >
            +
          </button>
        </div>
        <button
          onClick={() => removeFromCart(item.id, item.size)}
          className="p-2 sm:p-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <TrashIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
