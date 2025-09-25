import React, { useState, useEffect } from 'react';
import { Product } from '@/types';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import { supabase } from '@/lib/supabase'; // Using client-side supabase for image upload
import { v4 as uuidv4 } from 'uuid';
import Image from 'next/image';
import { XCircleIcon } from '@heroicons/react/24/outline';

interface AdminProductFormProps {
  product?: Product | null;
  onSave: () => void;
  onCancel: () => void;
}

const AdminProductForm = ({ product, onSave, onCancel }: AdminProductFormProps) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    images: [],
    category: '',
    sizes: [],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newSizeInput, setNewSizeInput] = useState('');

  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        name: '',
        description: '',
        price: 0,
        stock: 0,
        images: [],
        category: '',
        sizes: ['M'], // Default size
      });
    }
    setErrors({});
    setImageFiles([]);
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveImage = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setFormData((prev) => ({
        ...prev,
        images: prev.images?.filter((_, i) => i !== index),
      }));
    } else {
      setImageFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleAddSize = () => {
    if (newSizeInput.trim() && !formData.sizes?.includes(newSizeInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        sizes: [...(prev.sizes || []), newSizeInput.trim()],
      }));
      setNewSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      sizes: prev.sizes?.filter((size) => size !== sizeToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Product name is required.';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be a positive number.';
    if (formData.stock === undefined || formData.stock < 0) newErrors.stock = 'Stock cannot be negative.';
    if (!formData.category) newErrors.category = 'Category is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    let imageUrls = formData.images || [];

    try {
      // Upload new images to Supabase Storage
      for (const file of imageFiles) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `public/${fileName}`;

        const { data, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        if (publicUrlData) {
          imageUrls.push(publicUrlData.publicUrl);
        }
      }

      const productData = {
        ...formData,
        images: imageUrls,
      };

      const apiEndpoint = product?.id ? `/api/admin/products?id=${product.id}` : '/api/admin/products';
      const method = product?.id ? 'PUT' : 'POST';

      const response = await fetch(apiEndpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save product.');
      }

      onSave();
    } catch (err: any) {
      console.error('Error saving product:', err);
      setErrors({ general: err.message || 'An unexpected error occurred.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
      <h2 className="text-3xl font-black text-black mb-8">{product ? 'Edit Product' : 'Add New Product'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="name"
          label="Product Name"
          name="name"
          type="text"
          value={formData.name || ''}
          onChange={handleChange}
          error={errors.name}
          required
        />
        <div className="mb-4">
          <label htmlFor="description" className="block text-text text-sm font-medium mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 bg-background border border-border rounded-lg text-text placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
          ></textarea>
        </div>
        <Input
          id="price"
          label="Price"
          name="price"
          type="number"
          step="0.01"
          value={formData.price || ''}
          onChange={handleChange}
          error={errors.price}
          required
        />
        <Input
          id="stock"
          label="Stock"
          name="stock"
          type="number"
          value={formData.stock || ''}
          onChange={handleChange}
          error={errors.stock}
          required
        />
        <Select
          id="category"
          label="Category"
          name="category"
          value={formData.category || ''}
          onChange={handleChange}
          error={errors.category}
          required
          options={[
            { value: '', label: 'Select Category' },
            { value: 'men', label: 'Men' },
            { value: 'women', label: 'Women' }
          ]}
        />

        {/* Sizes Management */}
        <div className="mb-6">
          <label className="block text-black text-sm font-medium mb-3">Sizes</label>
          <div className="flex flex-wrap gap-2 mb-4">
            {formData.sizes?.map((size, index) => (
              <span key={index} className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-2 rounded-full text-sm font-medium">
                {size}
                <button 
                  type="button" 
                  onClick={() => handleRemoveSize(size)} 
                  className="ml-2 text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                >
                  <XCircleIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Input
              id="new-size"
              type="text"
              value={newSizeInput}
              onChange={(e) => setNewSizeInput(e.target.value)}
              placeholder="Add new size (e.g., S, M, L, XL)"
              className="flex-grow"
            />
            <button 
              type="button" 
              onClick={handleAddSize} 
              className="px-6 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
            >
              Add Size
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label htmlFor="images" className="block text-text text-sm font-medium mb-2">
            Product Images
          </label>
          <input
            id="images"
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-textSecondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/20 file:text-primary hover:file:bg-primary/30"
          />
          <div className="mt-4 grid grid-cols-3 gap-4">
            {formData.images?.map((imgUrl, index) => (
              <div key={`existing-${index}`} className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                <Image src={imgUrl} alt="Product Image" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, true)}
                  className="absolute top-1 right-1 bg-error text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            {imageFiles.map((file, index) => (
              <div key={`new-${index}`} className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                <Image src={URL.createObjectURL(file)} alt="New Product Image" fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index, false)}
                  className="absolute top-1 right-1 bg-error text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {errors.general && <p className="text-red-600 text-sm">{errors.general}</p>}

        <div className="flex justify-end space-x-4 mt-8">
          <button 
            type="button" 
            onClick={onCancel} 
            disabled={loading}
            className="px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="px-8 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {product ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
