import Link from 'next/link';
import { Bars3Icon } from '@heroicons/react/24/outline';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

const AdminHeader = ({ onMenuClick }: AdminHeaderProps) => {
  return (
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-700"
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link href="/admin" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-black rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <span className="text-yellow-400 font-black text-2xl">D</span>
              </div>
              <span className="text-2xl font-black text-black">DeFit</span>
              <span className="text-sm bg-yellow-400 text-black px-3 py-1 rounded-full font-bold">
                ADMIN
              </span>
            </Link>
          </div>
          <Link 
            href="/" 
            className="text-gray-600 hover:text-black font-medium transition-all duration-300 hidden sm:inline"
          >
            View Store
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;