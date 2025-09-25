import { GetStaticPaths, GetStaticProps } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface ProductDetailsPageProps {
  product: Product | null;
}

const ProductDetailsPage = ({ product }: ProductDetailsPageProps) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [addedToCartMessage, setAddedToCartMessage] = useState<string | null>(null);

  if (router.isFallback) {
    return <LoadingSpinner />;
  }

  if (!product) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-black text-black mb-4">Product Not Found</h1>
            <p className="text-gray-600 text-lg mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <button
              onClick={() => router.push('/products')}
              className="bg-black text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Browse All Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    setError(null);
    setAddedToCartMessage(null);

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setError('Please select a size.');
      return;
    }
    if (quantity <= 0) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items left in stock.`);
      return;
    }

    addToCart(product, quantity, selectedSize || 'One Size');
    setAddedToCartMessage(`${quantity} x ${product.name} (${selectedSize || 'One Size'}) added to cart!`);
    setTimeout(() => setAddedToCartMessage(null), 3000); // Clear message after 3 seconds
  };

  const mainImageUrl = product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-white p-6 sm:p-8 lg:p-12 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-200">
          {/* Product Images */}
          <div className="space-y-4 sm:space-y-6">
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={mainImageUrl}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
                {product.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="relative w-full h-16 sm:h-20 md:h-24 rounded-lg sm:rounded-xl overflow-hidden shadow-md border border-gray-200">
                    <Image
                      src={img}
                      alt={`${product.name} - ${index + 2}`}
                      fill
                      sizes="25vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col justify-between space-y-6 sm:space-y-8">
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black mb-2 sm:mb-3">{product.name}</h1>
                <p className="text-gray-600 text-lg sm:text-xl mb-4 sm:mb-6 capitalize">{product.category}</p>
                <p className="text-yellow-500 text-3xl sm:text-4xl md:text-5xl font-black mb-6 sm:mb-8">{formatCurrency(product.price)}</p>
              </div>

              <p className="text-gray-600 leading-relaxed text-sm sm:text-base md:text-lg">{product.description}</p>

              <div className="flex items-center space-x-4">
                {product.stock > 0 ? (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ In Stock: {product.stock}
                  </span>
                ) : (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                    ✗ Out of Stock
                  </span>
                )}
              </div>

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-black">Select Size</label>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-black text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  {error && !selectedSize && (
                    <p className="text-red-600 text-sm">{error}</p>
                  )}
                </div>
              )}

              {/* Quantity Selection */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-black">Quantity</label>
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
                {error && (quantity <= 0 || quantity > product.stock) && (
                  <p className="text-red-600 text-sm">{error}</p>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || quantity <= 0 || (product.sizes && product.sizes.length > 0 && !selectedSize)}
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              {addedToCartMessage && (
                <div className="p-4 bg-green-100 text-green-800 rounded-xl text-center animate-fade-in">
                  {addedToCartMessage}
                </div>
              )}
              
              {error && (
                <div className="p-4 bg-red-100 text-red-800 rounded-xl text-center animate-fade-in">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: products } = await supabase.from('products').select('id');

  const paths = products?.map((product) => ({
    params: { id: product.id },
  })) || [];

  return {
    paths,
    fallback: true, // Enable fallback to handle new products or products not in static generation
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { id } = params as { id: string };

  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !product) {
    console.error('Error fetching product:', error);
    return {
      notFound: true,
      revalidate: 10,
    };
  }

  return {
    props: {
      product,
    },
    revalidate: 10, // Revalidate every 10 seconds
  };
};

export default ProductDetailsPage;
