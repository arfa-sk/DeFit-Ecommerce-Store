import { GetServerSideProps } from 'next';
import { supabase } from '@/lib/supabase';
import { Order } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import Button from '@/components/ui/Button';
import Link from 'next/link';

interface Props {
  order: Pick<Order, 'id' | 'status' | 'total' | 'order_items' | 'created_at'> | null;
}

export default function TrackOrderDetails({ order }: Props) {
  if (!order) {
    return (
      <div className="min-h-screen py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-3xl font-black text-black mb-4">Order Not Found</h1>
            <p className="text-gray-600 text-lg mb-8">The order you're looking for doesn't exist or has been removed.</p>
            <Link href="/track-order">
              <button className="bg-black text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Track Another Order
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-center text-black mb-8 sm:mb-12">
          Order Status
        </h1>
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-gray-600 mb-2">
                <strong className="text-black">Order ID:</strong>{' '}
                <span className="font-mono text-black font-bold">{order.id.slice(0, 8).toUpperCase()}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigator.clipboard.writeText(order.id.slice(0, 8).toUpperCase())}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Copy ID
              </button>
              <Link href="/track-order">
                <button className="px-4 py-2 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  Track Another
                </button>
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Order Date</p>
              <p className="text-black font-bold">{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Total Amount</p>
              <p className="text-yellow-500 font-black text-xl">{formatCurrency(order.total)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl">
              <p className="text-gray-600 text-sm mb-1">Status</p>
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
          
          <h3 className="text-xl sm:text-2xl font-black text-black mb-6">Order Items</h3>
          <div className="space-y-4">
            {order.order_items.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div>
                  <span className="text-black font-medium text-lg">{item.name}</span>
                  <span className="text-gray-600 text-sm ml-2">({item.size}) x {item.quantity}</span>
                </div>
                <span className="text-yellow-500 font-black text-xl">{formatCurrency(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params }) => {
  const id = params?.id as string;
  const { data: order, error } = await supabase
    .from('orders')
    .select('id, status, total, order_items, created_at')
    .eq('id', id)
    .single();

  if (error || !order) {
    return { props: { order: null } };
  }
  return { props: { order } };
};


