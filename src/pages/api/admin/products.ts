import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { Product } from '@/types';
import { parseCookies, isAdminAuthenticated } from '@/lib/auth';

// Create admin client per request to avoid crashing at module load if env is missing

// Cookie-based admin authentication
const authenticateAdmin = (req: NextApiRequest, res: NextApiResponse, next: () => void) => {
  const cookies = parseCookies(req.headers.cookie);
  if (!isAdminAuthenticated(cookies)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseAdmin = createAdminClient();
  // Apply authentication middleware
  let authenticated = false;
  authenticateAdmin(req, res, () => { authenticated = true; });
  if (!authenticated) return; // If not authenticated, response already sent by middleware

  switch (req.method) {
    case 'GET':
      try {
        const { lowStock } = req.query;
        let query = supabaseAdmin.from('products').select('*');

        // Filter by low stock if requested
        if (lowStock) {
          const threshold = parseInt(lowStock as string) || 10;
          query = query.lt('stock', threshold);
        }

        const { data: products, error } = await query.order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch products error:', error);
          return res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
        }
        return res.status(200).json({ products });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    case 'POST':
      try {
        const newProduct: Partial<Product> = req.body;
        const { data, error } = await supabaseAdmin
          .from('products')
          .insert(newProduct)
          .select()
          .single();

        if (error) {
          console.error('Supabase insert product error:', error);
          return res.status(500).json({ message: 'Failed to add product.', error: error.message });
        }
        return res.status(201).json({ message: 'Product added successfully!', product: data });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const updatedProduct: Partial<Product> = req.body;

        if (!id) {
          return res.status(400).json({ message: 'Product ID is required for update.' });
        }

        const { data, error } = await supabaseAdmin
          .from('products')
          .update(updatedProduct)
          .eq('id', id as string)
          .select()
          .single();

        if (error) {
          console.error('Supabase update product error:', error);
          return res.status(500).json({ message: 'Failed to update product.', error: error.message });
        }
        return res.status(200).json({ message: 'Product updated successfully!', product: data });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    case 'DELETE':
      try {
        const { id } = req.query;

        if (!id) {
          return res.status(400).json({ message: 'Product ID is required for deletion.' });
        }

        const { error } = await supabaseAdmin
          .from('products')
          .delete()
          .eq('id', id as string);

        if (error) {
          console.error('Supabase delete product error:', error);
          return res.status(500).json({ message: 'Failed to delete product.', error: error.message });
        }
        return res.status(200).json({ message: 'Product deleted successfully!' });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
