import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCartIcon, Bars3Icon, XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

const Header = () => {
  const { cartItemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3 group">
            <div className="w-8 sm:w-10 h-8 sm:h-10 bg-black rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-yellow-400 font-black text-lg sm:text-2xl">D</span>
            </div>
            <span className="text-2xl sm:text-3xl font-black text-black">DeFit</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-12">
            <Link href="/" className="text-gray-700 hover:text-black font-medium transition-colors duration-300 text-base lg:text-lg">
              Home
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-black font-medium transition-colors duration-300 flex items-center gap-2 text-base lg:text-lg">
                Shop
                <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-4 w-48 lg:w-56 bg-white rounded-2xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 z-50">
                <div className="py-4">
                  <Link href="/products" className="block px-4 lg:px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-300 text-sm lg:text-base">
                    All Products
                  </Link>
                  <Link href="/products?category=men" className="block px-4 lg:px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-300 text-sm lg:text-base">
                    Men's Collection
                  </Link>
                  <Link href="/products?category=women" className="block px-4 lg:px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors duration-300 text-sm lg:text-base">
                    Women's Collection
                  </Link>
                </div>
              </div>
            </div>
            <Link 
              href="/track-order" 
              className="text-gray-700 hover:text-black font-medium transition-colors duration-300 text-base lg:text-lg"
            >
              Track Order
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 sm:p-3 text-gray-700 hover:text-black transition-colors duration-300 hover:bg-gray-100 rounded-xl"
            >
              <MagnifyingGlassIcon className="h-5 sm:h-6 w-5 sm:w-6" />
            </button>

            {/* Cart */}
            <Link 
              href="/cart" 
              className="relative p-2 sm:p-3 text-gray-700 hover:text-black transition-colors duration-300 hover:bg-gray-100 rounded-xl"
            >
              <ShoppingCartIcon className="h-5 sm:h-6 w-5 sm:w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 sm:h-6 w-5 sm:w-6 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 sm:p-3 text-gray-700 hover:text-black transition-colors duration-300 hover:bg-gray-100 rounded-xl"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 sm:h-6 w-5 sm:w-6" />
              ) : (
                <Bars3Icon className="h-5 sm:h-6 w-5 sm:w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 sm:py-6 border-t border-gray-200 animate-slide-down">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 sm:px-6 py-3 sm:py-4 pl-10 sm:pl-12 pr-4 sm:pr-6 text-gray-900 bg-gray-50 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent text-sm sm:text-base lg:text-lg"
              />
              <MagnifyingGlassIcon className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-5 sm:h-6 w-5 sm:w-6 text-gray-400" />
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 sm:py-6 border-t border-gray-200 animate-slide-down">
            <nav className="flex flex-col space-y-4 sm:space-y-6">
              <Link 
                href="/" 
                className="text-gray-700 hover:text-black font-medium transition-colors duration-300 py-2 sm:py-3 text-base sm:text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <div className="space-y-3 sm:space-y-4">
                <div className="text-gray-700 font-medium py-2 sm:py-3 text-base sm:text-lg">Shop</div>
                <div className="pl-4 sm:pl-6 space-y-3 sm:space-y-4">
                  <Link 
                    href="/products" 
                    className="block text-gray-600 hover:text-black transition-colors duration-300 py-2 text-sm sm:text-base lg:text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    All Products
                  </Link>
                  <Link 
                    href="/products?category=men" 
                    className="block text-gray-600 hover:text-black transition-colors duration-300 py-2 text-sm sm:text-base lg:text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Men's Collection
                  </Link>
                  <Link 
                    href="/products?category=women" 
                    className="block text-gray-600 hover:text-black transition-colors duration-300 py-2 text-sm sm:text-base lg:text-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Women's Collection
                  </Link>
                </div>
              </div>
              <Link 
                href="/track-order" 
                className="text-gray-700 hover:text-black font-medium transition-colors duration-300 py-2 sm:py-3 text-base sm:text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link 
                href="/cart" 
                className="flex items-center text-gray-700 hover:text-black font-medium transition-colors duration-300 py-2 sm:py-3 text-base sm:text-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ShoppingCartIcon className="h-5 sm:h-6 w-5 sm:w-6 mr-2 sm:mr-3" />
                Cart
                {cartItemCount > 0 && (
                  <span className="ml-2 sm:ml-3 bg-yellow-400 text-black text-xs font-bold rounded-full h-5 sm:h-6 w-5 sm:w-6 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;