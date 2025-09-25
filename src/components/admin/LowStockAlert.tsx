import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/helpers';
import Image from 'next/image';

interface LowStockAlertProps {
  threshold?: number;
}

const LowStockAlert = ({ threshold = 10 }: LowStockAlertProps) => {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(true);

  useEffect(() => {
    fetchLowStockProducts();
  }, [threshold]);

  const fetchLowStockProducts = async () => {
    try {
      const response = await fetch(`/api/admin/products?lowStock=${threshold}`);
      const data = await response.json();
      if (response.ok) {
        setLowStockProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error fetching low stock products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!showAlert || loading || lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 animate-slide-down">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-xl">
            <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-800">
              Low Stock Alert
            </h3>
            <p className="text-sm text-red-600">
              {lowStockProducts.length} product{lowStockProducts.length !== 1 ? 's' : ''} below {threshold} units
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAlert(false)}
          className="text-red-400 hover:text-red-600 transition-colors duration-200"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {lowStockProducts.slice(0, 6).map((product) => (
          <div key={product.id} className="bg-white p-4 rounded-xl border border-red-200 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                <Image
                  src={product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                  alt={product.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">
                  {product.name}
                </h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">Stock:</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    product.stock <= 5 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.stock} units
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {lowStockProducts.length > 6 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-red-600">
            And {lowStockProducts.length - 6} more products with low stock
          </p>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          onClick={() => window.location.href = '/admin/products'}
          className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200"
        >
          Manage Products
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert;
