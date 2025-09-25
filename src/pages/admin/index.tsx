import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { GetServerSideProps } from 'next';
import { parseCookies, isAdminAuthenticated } from '@/lib/auth';
import { AdminStats } from '@/types';
import LowStockAlert from '@/components/admin/LowStockAlert';
import { 
  ShoppingBagIcon, 
  CubeIcon, 
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (response.ok) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: { 
    title: string; 
    value: number | string; 
    icon: any; 
    color: string; 
    trend?: string;
  }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-black ${color}`}>{value}</p>
          {trend && <p className="text-xs text-gray-500 mt-1">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${color.includes('text-yellow') ? 'bg-yellow-100' : color.includes('text-red') ? 'bg-red-100' : color.includes('text-green') ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-black text-black mb-4 animate-slide-in-left">
          Admin
          <span className="block text-yellow-400">Dashboard</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-slide-in-left" style={{animationDelay: '0.2s'}}>
          Manage your store with powerful tools and insights
        </p>
      </div>

      {/* Low Stock Alert */}
      <LowStockAlert threshold={10} />

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={ShoppingBagIcon}
            color="text-black"
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon={ClockIcon}
            color="text-yellow-600"
          />
          <StatCard
            title="Total Revenue"
            value={`Rs ${stats.totalRevenue.toLocaleString()}`}
            icon={CurrencyDollarIcon}
            color="text-green-600"
          />
          <StatCard
            title="Low Stock Items"
            value={stats.lowStockProducts}
            icon={ExclamationTriangleIcon}
            color="text-red-600"
          />
        </div>
      )}

      {/* Order Status Overview */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <div className="flex items-center">
              <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
              <span className="text-sm font-medium text-yellow-800">Pending</span>
            </div>
            <p className="text-2xl font-black text-yellow-900 mt-1">{stats.pendingOrders}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center">
              <TruckIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800">Shipped</span>
            </div>
            <p className="text-2xl font-black text-blue-900 mt-1">{stats.shippedOrders}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800">Delivered</span>
            </div>
            <p className="text-2xl font-black text-green-900 mt-1">{stats.deliveredOrders}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-xl border border-red-200">
            <div className="flex items-center">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800">Cancelled</span>
            </div>
            <p className="text-2xl font-black text-red-900 mt-1">{stats.cancelledOrders}</p>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-in-left" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center mr-4">
              <CubeIcon className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-3xl font-black text-black">Product Management</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">Add, edit, and delete products. Manage stock, images, and categories with ease.</p>
          <button
            onClick={() => router.push('/admin/products')}
            className="bg-black text-white font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
            Go to Products
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-500 hover:scale-105 animate-slide-in-right" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center mr-4">
              <ShoppingBagIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-black text-black">Order Management</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">View and update the status of customer orders. Track fulfillment and delivery.</p>
          <button
            onClick={() => router.push('/admin/orders')}
            className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
          >
            <span className="flex items-center gap-2">
            Go to Orders
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx.req.headers.cookie);
  if (!isAdminAuthenticated(cookies)) {
    return {
      redirect: { destination: '/admin-login', permanent: false },
    };
  }
  return { props: {} };
};
