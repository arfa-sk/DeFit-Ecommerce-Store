import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types';
import ProductCard from '@/components/common/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { useRouter } from 'next/router';

interface ProductsPageProps {
  products: Product[];
  category?: string;
}

const ProductsPage = ({ products, category }: ProductsPageProps) => {
  const router = useRouter();
  const { category: queryCategory } = router.query;

  const getPageTitle = () => {
    if (queryCategory === 'men') return "Men's Collection";
    if (queryCategory === 'women') return "Women's Collection";
    return "Our Collection";
  };

  const getPageDescription = () => {
    if (queryCategory === 'men') return "Discover our premium men's fashion collection";
    if (queryCategory === 'women') return "Explore our elegant women's fashion collection";
    return "Discover our complete collection of premium fashion essentials";
  };

  return (
    <div className="min-h-screen py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-black text-gray-900 mb-4">
          {getPageTitle()}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {getPageDescription()}
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex justify-center mb-12">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="flex space-x-2">
            <button
              onClick={() => router.push('/products')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !queryCategory || queryCategory === 'all'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              All Products
            </button>
            <button
              onClick={() => router.push('/products?category=men')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                queryCategory === 'men'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              Men's
            </button>
            <button
              onClick={() => router.push('/products?category=women')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                queryCategory === 'women'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg'
                  : 'text-gray-600 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              Women's
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center text-gray-600 text-xl">
          <p>No products found in this category.</p>
          <p className="text-sm mt-2">Try browsing other categories or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { category } = context.query;

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  // Filter by category if specified
  if (category && category !== 'all') {
    query = query.eq('category', category);
  }

  const { data: products, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return {
      props: {
        products: [],
        category: category || null,
      },
    };
  }

  return {
    props: {
      products: products || [],
      category: category || null,
    },
  };
};

export default ProductsPage;
