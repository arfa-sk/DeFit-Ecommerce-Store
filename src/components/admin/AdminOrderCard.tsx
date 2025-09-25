import React, { useState } from 'react';
import { Order, OrderStatus, OrderStatusUpdate } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import { 
  CheckCircleIcon, 
  TruckIcon, 
  ArchiveBoxIcon, 
  XCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface AdminOrderCardProps {
  order: Order;
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
  loading: boolean;
}

const AdminOrderCard = ({ order, onUpdateStatus, loading }: AdminOrderCardProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus>(order.status);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusHistory, setShowStatusHistory] = useState(false);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <ArchiveBoxIcon className="h-5 w-5 mr-2" />;
      case 'shipped': return <TruckIcon className="h-5 w-5 mr-2" />;
      case 'delivered': return <CheckCircleIcon className="h-5 w-5 mr-2" />;
      case 'cancelled': return <XCircleIcon className="h-5 w-5 mr-2" />;
      default: return null;
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  // Mock status history - in real app, this would come from the API
  const statusHistory: OrderStatusUpdate[] = order.status_history || [
    { status: 'pending', updated_at: order.created_at, updated_by: 'system' },
    ...(order.status !== 'pending' ? [{ status: order.status, updated_at: order.updated_at, updated_by: 'admin' }] : [])
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg sm:text-xl font-black text-black">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h3>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)} {order.status.toUpperCase()}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span className="text-yellow-600 font-bold text-lg">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <span className="text-sm font-medium">Details</span>
              {showDetails ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Info - Always Visible */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">Customer:</span>
            <p className="font-semibold text-black">{order.customer_name}</p>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <p className="font-semibold text-black">{order.customer_phone}</p>
          </div>
          <div className="sm:col-span-2">
            <span className="text-gray-500">Email:</span>
            <p className="font-semibold text-black">{order.customer_email}</p>
          </div>
        </div>
      </div>

      {/* Expandable Details */}
      {showDetails && (
        <div className="p-4 sm:p-6 space-y-6 animate-slide-down">
          {/* Address */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Shipping Address</h4>
            <p className="text-gray-600 text-sm">{order.customer_address}</p>
          </div>

          {/* Order Items */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Order Items</h4>
            <div className="space-y-2">
              {order.order_items.map((item, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium text-sm">{item.name}</span>
                    <span className="text-gray-500 text-xs ml-2">({item.size}) x {item.quantity}</span>
                  </div>
                  <span className="text-yellow-600 font-bold text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Status History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-700">Status History</h4>
              <button
                onClick={() => setShowStatusHistory(!showStatusHistory)}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
              >
                {showStatusHistory ? 'Hide' : 'Show'} History
                {showStatusHistory ? <ChevronUpIcon className="h-3 w-3" /> : <ChevronDownIcon className="h-3 w-3" />}
              </button>
            </div>
            
            {showStatusHistory && (
              <div className="space-y-2 animate-slide-down">
                {statusHistory.map((update, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(update.status)}
                      <span className="text-sm font-medium capitalize">{update.status}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(update.updated_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Status Update Section */}
      <div className="p-4 sm:p-6 bg-gray-50">
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as OrderStatus)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent bg-white text-black text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            onClick={() => onUpdateStatus(order.id, selectedStatus)}
            disabled={loading || selectedStatus === order.status}
            className="px-6 py-2 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderCard;
