import { useState } from 'react';
import { useRouter } from 'next/router';
import { useCart } from '@/contexts/CartContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { OrderItem } from '@/types';
import { formatCurrency } from '@/lib/helpers';
// Toast notifications can be added via react-hot-toast if desired

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    paymentMethod: 'Cash on Delivery',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required.';
    if (!formData.phone) newErrors.phone = 'Phone is required.';
    if (!formData.email) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';
    if (!formData.address) newErrors.address = 'Address is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (cart.length === 0) {
      alert('Your cart is empty!'); // Replace with toast notification
      return;
    }

    setLoading(true);
    setErrors({});

    const orderItems: OrderItem[] = cart.map(item => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      image: item.image,
    }));

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          customer_address: formData.address,
          order_items: orderItems,
          total: cartTotal,
          payment_method: formData.paymentMethod,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          if (typeof window !== 'undefined') {
            const recentRaw = localStorage.getItem('defit_recent_orders') || '[]';
            const recent: string[] = JSON.parse(recentRaw);
            const newList = [data.orderId, ...recent.filter((id: string) => id !== data.orderId)].slice(0, 5);
            localStorage.setItem('defit_recent_orders', JSON.stringify(newList));
          }
        } catch {}
        clearCart();
        router.push(`/track-order/${data.orderId}`);
      } else {
        setErrors(data.errors || { general: data.message || 'An unexpected error occurred.' });
        alert(data.message || 'Failed to place order.'); // Replace with toast
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setErrors({ general: 'Network error or server is unreachable.' });
      alert('Network error or server is unreachable.'); // Replace with toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black mb-8 sm:mb-12">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-black text-black mb-6 sm:mb-8">Shipping Information</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-black mb-2">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                {errors.name && <p className="mt-1 text-red-600 text-sm">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black mb-2">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                {errors.phone && <p className="mt-1 text-red-600 text-sm">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black mb-2">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black mb-2">Shipping Address</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  required
                />
                {errors.address && <p className="mt-1 text-red-600 text-sm">{errors.address}</p>}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">Payment Method</h2>
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <label className="flex items-center text-black">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="h-5 w-5 text-yellow-500 focus:ring-yellow-400"
                    />
                    <span className="ml-3 text-lg font-medium">Cash on Delivery</span>
                  </label>
                  <p className="text-gray-600 text-sm mt-2 ml-8">Pay with cash upon delivery. You'll receive your order confirmation and tracking details on the next page.</p>
                </div>
              </div>

              {errors.general && (
                <div className="p-4 bg-red-100 text-red-800 rounded-xl">
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              <button 
                type="submit" 
                className="w-full bg-black text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
                disabled={cart.length === 0 || loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  `Place Order (${formatCurrency(cartTotal)})`
                )}
              </button>
            </form>
          </div>
          <div className="lg:col-span-1">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 sticky top-8">
              <h2 className="text-2xl sm:text-3xl font-black text-black mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600 text-lg">
                  <span>Items ({cart.length})</span>
                  <span>{formatCurrency(cartTotal)}</span>
                </div>
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-black font-black text-xl sm:text-2xl">
                    <span>Total</span>
                    <span className="text-yellow-500">{formatCurrency(cartTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
