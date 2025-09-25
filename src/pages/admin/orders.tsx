import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { GetServerSideProps } from 'next';
import { parseCookies, isAdminAuthenticated } from '@/lib/auth';
import AdminOrderCard from '@/components/admin/AdminOrderCard';
import { Order, OrderStatus, OrderFilters } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'current' | 'past'>('current');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    dateFrom: '',
    dateTo: '',
    minAmount: 0,
    maxAmount: 0
  });

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/orders');
      const data = await response.json();
      if (response.ok) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      } else {
        throw new Error(data.message || 'Failed to fetch orders.');
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'An error occurred while fetching orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on active tab and filters
  useEffect(() => {
    let filtered = orders;

    // Filter by tab (current vs past)
    if (activeTab === 'current') {
      filtered = filtered.filter(order => order.status === 'pending' || order.status === 'shipped');
    } else {
      filtered = filtered.filter(order => order.status === 'delivered' || order.status === 'cancelled');
    }

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer_name.toLowerCase().includes(searchTerm) ||
        order.customer_phone.includes(searchTerm) ||
        order.customer_email.toLowerCase().includes(searchTerm)
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(order => order.status === filters.status);
    }

    // Apply date range filter
    if (filters.dateFrom) {
      filtered = filtered.filter(order => new Date(order.created_at) >= new Date(filters.dateFrom));
    }
    if (filters.dateTo) {
      filtered = filtered.filter(order => new Date(order.created_at) <= new Date(filters.dateTo));
    }

    // Apply amount range filter
    if (filters.minAmount > 0) {
      filtered = filtered.filter(order => order.total >= filters.minAmount);
    }
    if (filters.maxAmount > 0) {
      filtered = filtered.filter(order => order.total <= filters.maxAmount);
    }

    setFilteredOrders(filtered);
  }, [orders, activeTab, filters]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    setUpdatingOrderId(orderId);
    setError(null);
    try {
      const response = await fetch(`/api/admin/orders?id=${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      if (response.ok) {
        fetchOrders(); // Re-fetch orders to update UI
      } else {
        throw new Error(data.message || 'Failed to update order status.');
      }
    } catch (err: any) {
      console.error('Error updating order status:', err);
      setError(err.message || 'An error occurred while updating order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleFilterChange = (key: keyof OrderFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      dateFrom: '',
      dateTo: '',
      minAmount: 0,
      maxAmount: 0
    });
  };

  const getTabCounts = () => {
    const current = orders.filter(order => order.status === 'pending' || order.status === 'shipped').length;
    const past = orders.filter(order => order.status === 'delivered' || order.status === 'cancelled').length;
    return { current, past };
  };

  const tabCounts = getTabCounts();

  return (
    <AdminLayout>
      <div className="animate-fade-in-up">
        <h1 className="text-4xl sm:text-5xl font-black text-black mb-8">Order Management</h1>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Input */}
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID, customer name, phone, or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            >
              <FunnelIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAmount || ''}
                      onChange={(e) => handleFilterChange('minAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAmount || ''}
                      onChange={(e) => handleFilterChange('maxAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <XMarkIcon className="h-4 w-4" />
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-8">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('current')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors duration-200 ${
                activeTab === 'current'
                  ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <ClockIcon className="h-5 w-5" />
                <span>Current Orders</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  {tabCounts.current}
                </span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-4 text-center font-semibold transition-colors duration-200 ${
                activeTab === 'past'
                  ? 'text-yellow-600 border-b-2 border-yellow-400 bg-yellow-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Past Orders</span>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                  {tabCounts.past}
                </span>
              </div>
            </button>
          </div>
        </div>

      {loading && <LoadingSpinner />}
        {error && (
          <div className="p-4 bg-red-100 text-red-800 rounded-xl text-center my-8">
            <p className="text-lg">{error}</p>
          </div>
        )}

        {!loading && !error && filteredOrders.length === 0 && (
          <div className="text-center text-gray-600 text-xl py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
            <p>No {activeTab} orders found.</p>
            {filters.search && (
              <p className="text-sm mt-2">Try adjusting your search or filters.</p>
            )}
        </div>
      )}

        {!loading && !error && filteredOrders.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredOrders.map((order) => (
            <AdminOrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateOrderStatus}
              loading={updatingOrderId === order.id}
            />
          ))}
        </div>
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminOrdersPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx.req.headers.cookie);
  if (!isAdminAuthenticated(cookies)) {
    return {
      redirect: { destination: '/admin-login', permanent: false },
    };
  }
  return { props: {} };
};
