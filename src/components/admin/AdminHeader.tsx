import Link from 'next/link';
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const AdminHeader = () => {
  const router = useRouter();

  const handleLogout = () => {
    fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'logout' }),
    }).finally(() => router.push('/admin-login'));
  };

  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <span className="text-yellow-400 font-black text-2xl">D</span>
            </div>
            <span className="text-3xl font-black text-black">DeFit</span>
            <span className="text-sm bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
              ADMIN
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-600 hover:text-black font-medium transition-all duration-300"
            >
              View Store
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-gray-600 hover:text-black font-medium transition-all duration-300 group px-4 py-2 rounded-xl hover:bg-gray-100"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;