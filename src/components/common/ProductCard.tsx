import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import { HeartIcon, EyeIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const imageUrl = product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';


  return (
    <div 
      className="group relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-yellow-200 animate-zoom-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="block">
        {/* Image Container */}
        <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            priority={false}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Action Buttons */}
          <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                setIsLiked(!isLiked);
              }}
              className={`p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 ${isLiked ? 'animate-bounce' : ''}`}
            >
              {isLiked ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500 animate-scale-in" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600 group-hover:text-red-500 transition-colors duration-300" />
              )}
            </button>
            <Link href={`/products/${product.id}`} onClick={(e) => e.stopPropagation()} className="p-3 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg hover:bg-white transition-all duration-300 hover:scale-110 group-hover:animate-wiggle">
              <EyeIcon className="h-5 w-5 text-gray-600 group-hover:text-yellow-500 transition-colors duration-300" />
            </Link>
          </div>

          {/* Stock Badge */}
          {product.stock > 0 && (
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center px-3 py-2 rounded-2xl text-sm font-bold bg-green-100 text-green-800">
                In Stock
              </span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className="inline-flex items-center px-3 py-2 rounded-2xl text-sm font-bold bg-yellow-100 text-yellow-800 capitalize">
              {product.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 group-hover:text-yellow-500 transition-colors duration-300 line-clamp-2">
            {product.name}
          </h3>
          <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center space-x-2">
              <span className="text-lg sm:text-xl md:text-2xl font-black text-black">
                {formatCurrency(product.price)}
              </span>
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">
              Stock: {product.stock}
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href={`/products/${product.id}`}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white text-black font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-2xl border-2 border-gray-300 hover:border-black transition-all duration-300 text-center text-sm sm:text-base block"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
      
      {/* Size selection modal removed to avoid jitter; details page handles size & cart. */}
    </div>
  );
};

export default ProductCard;