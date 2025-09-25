import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';
import AdminHeader from './AdminHeader';
import { HomeIcon, CubeIcon, ShoppingBagIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).finally(() => router.push('/admin-login'));
  };

  const NavLinks = (
    <nav className="flex-grow space-y-2">
      <Link 
        href="/admin" 
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
          router.pathname === '/admin'
            ? 'bg-yellow-400 text-black shadow-lg md:transform md:scale-105'
            : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md md:hover:scale-105'
        }`}
      >
        <HomeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-semibold">Dashboard</span>
      </Link>

      <Link 
        href="/admin/products" 
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
          router.pathname.startsWith('/admin/products')
            ? 'bg-yellow-400 text-black shadow-lg md:transform md:scale-105'
            : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md md:hover:scale-105'
        }`}
      >
        <CubeIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-semibold">Products</span>
      </Link>

      <Link 
        href="/admin/orders"
        onClick={() => setIsSidebarOpen(false)}
        className={`flex items-center p-4 rounded-2xl transition-all duration-300 group ${
          router.pathname.startsWith('/admin/orders')
            ? 'bg-yellow-400 text-black shadow-lg md:transform md:scale-105'
            : 'hover:bg-gray-100 text-gray-700 hover:text-black hover:shadow-md md:hover:scale-105'
        }`}
      >
        <ShoppingBagIcon className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform duration-300" />
        <span className="font-semibold">Orders</span>
      </Link>
    </nav>
  );

  return (
    <div className="min-h-screen bg-white">
      <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />

      {/* Mobile menu button moved into header */}

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside className="hidden md:flex w-64 bg-white p-6 shadow-lg border-r border-gray-200 flex-col min-h-screen">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-black mb-2">Admin Panel</h2>
            <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
          </div>
          {NavLinks}
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
            <Link href="/" className="block w-full text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-colors duration-200">View Store</Link>
            <button onClick={handleLogout} className="w-full px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors duration-200">Logout</button>
          </div>
        </aside>

        {/* Sidebar - mobile (off-canvas) */}
        <div className={`md:hidden fixed inset-0 z-50 ${isSidebarOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          {/* Backdrop */}
          <div 
            className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsSidebarOpen(false)}
          />
          {/* Panel */}
          <aside className={`absolute left-0 top-0 h-full w-72 bg-white p-6 shadow-xl border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-black">Admin Panel</h2>
                <div className="mt-2 w-10 h-1 bg-yellow-400 rounded-full"></div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 text-gray-700"
                aria-label="Close menu"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            {NavLinks}
            <div className="mt-auto pt-6 border-t border-gray-200 space-y-3">
              <Link href="/" onClick={() => setIsSidebarOpen(false)} className="block w-full text-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-colors duration-200">View Store</Link>
              <button onClick={() => { setIsSidebarOpen(false); handleLogout(); }} className="w-full px-4 py-2 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors duration-200">Logout</button>
            </div>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-grow p-4 sm:p-6 md:p-8">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
