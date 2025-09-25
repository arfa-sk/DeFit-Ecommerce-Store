import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { Order, OrderStatus } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const OrderTrackingPage = () => {
  const router = useRouter();
  const { orderId: queryOrderId } = router.query;

  const [orderId, setOrderId] = useState<string>((queryOrderId as string) || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  const handleTrackOrder = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(null);

    if (!orderId) {
      setError('Please enter an Order ID.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/track-order?orderId=${orderId}`);
      const data = await response.json();

      if (response.ok) {
        setOrder(data.order);
      } else {
        setError(data.message || 'Order not found or invalid credentials.');
      }
    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Automatically track order if query params are present on load
  useEffect(() => {
    if (queryOrderId) {
      setOrderId(queryOrderId as string);
      handleTrackOrder();
    }
  }, [queryOrderId]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('defit_recent_orders');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'text-warning';
      case 'shipped': return 'text-secondary';
      case 'delivered': return 'text-success';
      case 'cancelled': return 'text-error';
      default: return 'text-textSecondary';
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black mb-8 sm:mb-12">
          Track Your Order
        </h1>

        <div className="max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <form onSubmit={handleTrackOrder} className="space-y-6">
            <div>
              <label htmlFor="orderId" className="block text-sm font-medium text-black mb-2">Order ID</label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="Enter your order ID"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                required
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <MagnifyingGlassIcon className="h-5 w-5" />
                  Track Order
                </>
              )}
            </button>
          </form>

          {recent.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg sm:text-xl font-black text-black mb-4">Recent Orders</h3>
              <div className="space-y-3">
                {recent.map((rid) => (
                  <div key={rid} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <span className="font-mono text-sm text-gray-700">{rid.slice(0, 8).toUpperCase()}</span>
                    <button 
                      onClick={() => router.push(`/track-order/${rid}`)}
                      className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200"
                    >
                      Open
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 bg-red-100 text-red-800 rounded-xl text-center">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {order && (
            <div className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Order ID:</span>
                  <span className="font-mono text-black font-bold">{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Customer Name:</span>
                  <span className="text-black font-medium">{order.customer_name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Order Date:</span>
                  <span className="text-black font-medium">{new Date(order.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="text-yellow-500 font-black text-xl">{formatCurrency(order.total)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Status:</span>
                  <span className={`font-bold uppercase px-3 py-1 rounded-full text-sm ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>

              <h3 className="text-xl font-black text-black mt-8 mb-4">Order Items:</h3>
              <div className="space-y-3">
                {order.order_items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded-xl border border-gray-200">
                    <div>
                      <span className="text-black font-medium">{item.name}</span>
                      <span className="text-gray-600 text-sm ml-2">({item.size}) x {item.quantity}</span>
                    </div>
                    <span className="text-yellow-500 font-bold">{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
