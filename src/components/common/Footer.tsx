import Link from 'next/link';
import { HeartIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white border-t border-gray-200 relative overflow-hidden">
      <div className="absolute inset-x-0 -top-1 h-1 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 animate-shimmer" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center space-x-3 group mb-6 sm:mb-8">
              <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-yellow-400 font-black text-2xl">D</span>
              </div>
              <span className="text-4xl font-black text-black">DeFit</span>
            </Link>
            <p className="text-gray-600 leading-relaxed max-w-2xl text-base sm:text-lg animate-fade-in-up">
              Sophisticated fashion for the modern individual.
              Discover timeless pieces that define contemporary elegance.
            </p>

            {/* Decorative underline */}
            <div className="mt-6 h-1 w-24 bg-yellow-400 rounded-full animate-scale-in" />
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-black text-black mb-6">Explore</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-black transition-all duration-300 inline-flex items-center group">
                  <span className="h-1 w-1 rounded-full bg-yellow-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-gray-600 hover:text-black transition-all duration-300 inline-flex items-center group">
                  <span className="h-1 w-1 rounded-full bg-yellow-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=men" className="text-gray-600 hover:text-black transition-all duration-300 inline-flex items-center group">
                  <span className="h-1 w-1 rounded-full bg-yellow-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Men's Collection
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="text-gray-600 hover:text-black transition-all duration-300 inline-flex items-center group">
                  <span className="h-1 w-1 rounded-full bg-yellow-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Women's Collection
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-gray-600 hover:text-black transition-all duration-300 inline-flex items-center group">
                  <span className="h-1 w-1 rounded-full bg-yellow-400 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  Track Order
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-14 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-500 text-sm sm:text-base">
              <span>&copy; {new Date().getFullYear()} DeFit. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-6 text-sm sm:text-base text-gray-500">
              <a href="#" className="hover:text-black transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="hover:text-black transition-colors duration-300">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 p-3 sm:bottom-8 sm:right-8 sm:p-4 bg-black text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50 group"
        aria-label="Scroll to top"
      >
        <ArrowUpIcon className="h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-y-1 transition-transform duration-300" />
      </button>
    </footer>
  );
};

export default Footer;