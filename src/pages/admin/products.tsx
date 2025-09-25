import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import type { GetServerSideProps } from 'next';
import { parseCookies, isAdminAuthenticated } from '@/lib/auth';
import AdminProductForm from '@/components/admin/AdminProductForm';
import Button from '@/components/ui/Button';
import { Product } from '@/types';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { formatCurrency } from '@/lib/helpers';
import Image from 'next/image';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AdminProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products.');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      setError(err.message || 'An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (response.ok) {
        fetchProducts(); // Re-fetch products
      } else {
        throw new Error(data.message || 'Failed to delete product.');
      }
    } catch (err: any) {
      console.error('Error deleting product:', err);
      setError(err.message || 'An error occurred while deleting the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingProduct(null);
    fetchProducts(); // Re-fetch products after save
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
  };


  if (showForm) {
    return (
      <AdminLayout>
        <AdminProductForm product={editingProduct} onSave={handleFormSave} onCancel={handleFormCancel} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black">Product Management</h1>
                <button
                  onClick={handleAddProduct}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 md:px-8 md:py-4 bg-black text-white font-bold rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base md:text-lg"
                >
                  <PlusIcon className="h-5 w-5 md:h-6 md:w-6 mr-2 md:mr-3" />
                  Add New Product
                </button>
      </div>

      {loading && <LoadingSpinner />}
      {error && <p className="text-error text-center text-xl my-8">{error}</p>}

      {!loading && !error && products.length === 0 && (
        <div className="text-center text-gray-600 text-xl py-16 bg-white rounded-2xl shadow-lg border border-gray-200">
          <p>No products found. Click "Add New Product" to get started.</p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
              <>
                {/* Mobile cards */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {products.map((product) => (
                    <div key={product.id} className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 flex items-center gap-4">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                        <Image
                          src={product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                          alt={product.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-black font-semibold truncate">{product.name}</p>
                        <p className="text-gray-500 text-sm capitalize">{product.category}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-yellow-500 font-bold">{formatCurrency(product.price)}</span>
                          <span className="text-gray-600 text-sm">Stock: {product.stock}</span>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <button 
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 px-3 py-2 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors duration-200"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="px-3 py-2 bg-red-50 text-red-700 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors duration-200"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop table */}
                <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
                    <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                            <div className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200">
                      <Image
                        src={product.images[0] || 'https://images.pexels.com/photos/1037993/pexels-photo-1037993.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'}
                        alt={product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </td>
                          <td className="px-6 py-4 whitespace-nowrap text-black font-medium">
                    {product.name}
                  </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600 capitalize">
                    {product.category}
                  </td>
                          <td className="px-6 py-4 whitespace-nowrap text-yellow-500 font-bold">
                    {formatCurrency(product.price)}
                  </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                              <button 
                                onClick={() => handleEditProduct(product)}
                                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-300"
                              >
                        <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(product.id)}
                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-300"
                              >
                        <TrashIcon className="h-4 w-4" />
                              </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
              </>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parseCookies(ctx.req.headers.cookie);
  if (!isAdminAuthenticated(cookies)) {
    return {
      redirect: { destination: '/admin-login', permanent: false },
    };
  }
  return { props: {} };
};
