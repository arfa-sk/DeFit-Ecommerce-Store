import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import AdminHeader from './AdminHeader';
import { HomeIcon, CubeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader />

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white p-6 shadow-lg border-r border-gray-200 flex flex-col min-h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-black mb-2">Admin Panel</h2>
            <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          
          <nav className="flex-grow space-y-2">
            <Link 
              href="/admin" 
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                router.pathname === '/admin'
                  ? 'bg-yellow-400 text-black shadow-lg transform scale-105'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md hover:scale-105'
              }`}
            >
              <HomeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Dashboard</span>
            </Link>

            <Link 
              href="/admin/products" 
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                router.pathname.startsWith('/admin/products')
                  ? 'bg-yellow-400 text-black shadow-lg transform scale-105'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md hover:scale-105'
              }`}
            >
              <CubeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Products</span>
            </Link>

            <Link 
              href="/admin/orders" 
              className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
                router.pathname.startsWith('/admin/orders')
                  ? 'bg-yellow-400 text-black shadow-lg transform scale-105'
                  : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md hover:scale-105'
              }`}
            >
              <ShoppingBagIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
              <span className="font-semibold">Orders</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-grow p-8">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
