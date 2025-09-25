import { GetStaticProps } from 'next';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon, TruckIcon, ShieldCheckIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface HomePageProps {
  featuredProducts: Product[];
}

const HomePage = ({ featuredProducts }: HomePageProps) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-8 lg:space-y-10">
              <div className="animate-slide-in-left">
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-400 text-black text-xs sm:text-sm font-bold px-4 sm:px-6 py-2 sm:py-3 shadow-lg">
                  ✨ New Collection 2024
                </span>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.2s'}}>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-black leading-tight mb-4 sm:mb-6 lg:mb-8">
                  FIND CLOTHES THAT
                  <span className="block text-yellow-400">MATCHES YOUR STYLE</span>
                </h1>
              </div>

              <div className="animate-slide-in-left" style={{animationDelay: '0.4s'}}>
                <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mb-6 sm:mb-8 lg:mb-10 max-w-lg">
                  Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 animate-slide-in-left" style={{animationDelay: '0.6s'}}>
                <Link 
                  href="/products" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group text-sm sm:text-base lg:text-lg"
                >
                  Shop Now
                  <ChevronRightIcon className="ml-2 sm:ml-3 h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
                <Link 
                  href="/products?category=men" 
                  className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-white text-black font-bold rounded-2xl shadow-lg hover:shadow-xl border-2 border-black hover:bg-black hover:text-white transform hover:scale-105 transition-all duration-300 group text-sm sm:text-base lg:text-lg"
                >
                  Men's Collection
                  <ChevronRightIcon className="ml-2 sm:ml-3 h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 animate-slide-in-left" style={{animationDelay: '0.8s'}}>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">200+</div>
                  <div className="text-xs sm:text-sm text-gray-600">International Brands</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">2,000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">High-Quality Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-black">30,000+</div>
                  <div className="text-xs sm:text-sm text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] animate-fade-in-right" style={{animationDelay: '0.3s'}}>
              <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
        <Image
                  src="https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Fashion Model"
          fill
                  className="object-cover"
          priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-3 sm:-top-6 -right-3 sm:-right-6 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 bg-yellow-400 rounded-2xl sm:rounded-3xl shadow-xl animate-float"></div>
              <div className="absolute -bottom-3 sm:-bottom-6 -left-3 sm:-left-6 w-10 sm:w-16 lg:w-20 h-10 sm:h-16 lg:h-20 bg-black rounded-xl sm:rounded-2xl shadow-lg animate-float" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 sm:mb-6 lg:mb-8 animate-fade-in-up">
              Featured
              <span className="block text-yellow-400">Collection</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Handpicked pieces that define contemporary style and sophistication
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {featuredProducts.slice(0, 8).map((product, index) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <Link 
              href="/products" 
              className="inline-flex items-center justify-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 lg:py-5 bg-black text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group text-sm sm:text-base lg:text-lg"
            >
              View All Products
              <ChevronRightIcon className="ml-2 sm:ml-3 h-4 sm:h-5 lg:h-6 w-4 sm:w-5 lg:w-6 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-black mb-4 sm:mb-6 lg:mb-8 animate-fade-in-up">
              Why Choose
              <span className="block text-yellow-400">DeFit</span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              We're committed to delivering exceptional quality and service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            <div className="text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.3s'}}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-yellow-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <ShieldCheckIcon className="w-8 sm:w-10 h-8 sm:h-10 text-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Premium Quality</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                Every piece is carefully selected and crafted with the finest materials to ensure lasting comfort and style.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.4s'}}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-black rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <TruckIcon className="w-8 sm:w-10 h-8 sm:h-10 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Fast Shipping</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                Get your favorite pieces delivered quickly and securely with our reliable shipping partners.
              </p>
            </div>

            <div className="text-center p-6 sm:p-8 lg:p-10 bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 animate-fade-in-up border border-gray-100" style={{animationDelay: '0.5s'}}>
              <div className="w-16 sm:w-20 h-16 sm:h-20 bg-yellow-400 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-lg">
                <ArrowPathIcon className="w-8 sm:w-10 h-8 sm:h-10 text-black" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">Easy Returns</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base lg:text-lg">
                Your satisfaction is our priority. We're here to help you find the perfect style for every occasion.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        featuredProducts: [],
      },
    };
  }

  return {
    props: {
      featuredProducts: products || [],
    },
    revalidate: 60, // Revalidate every minute
  };
};

export default HomePage;