import { useState } from 'react';
import { Product } from '@/types';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SizeSelectionModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string) => void;
}

const SizeSelectionModal = ({ product, isOpen, onClose, onAddToCart }: SizeSelectionModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      alert('Please select a size');
      return;
    }
    onAddToCart(product, quantity, selectedSize || 'One Size');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black text-black">Select Size & Quantity</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Product Info */}
            <div className="flex space-x-4">
              <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-lg font-bold text-black truncate">{product.name}</h4>
                <p className="text-yellow-500 font-black text-xl">Rs {product.price.toLocaleString()}</p>
                <p className="text-gray-600 text-sm">Stock: {product.stock}</p>
              </div>
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 ? (
              <div>
                <label className="block text-sm font-medium text-black mb-3">Select Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size
                          ? 'bg-black text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-600 text-sm text-center">This product comes in one size only</p>
              </div>
            )}

            {/* Quantity Selection */}
            <div>
              <label className="block text-sm font-medium text-black mb-3">Quantity</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) || val < 1 ? 1 : Math.min(val, product.stock));
                  }}
                  className="w-20 h-10 text-center border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || (product.sizes && product.sizes.length > 0 && !selectedSize)}
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {product.stock === 0 ? 'Out of Stock' : 
                 product.sizes && product.sizes.length > 0 && !selectedSize ? 'Select Size First' : 
                 'Add to Cart'}
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SizeSelectionModal;
