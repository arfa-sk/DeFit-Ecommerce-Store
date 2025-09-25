import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { category } = req.query;
      
      let query = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      // Filter by category if provided
      if (category && (category === 'men' || category === 'women')) {
        query = query.eq('category', category);
      }

      const { data: products, error } = await query;

      if (error) {
        console.error('Supabase fetch products error:', error);
        return res.status(500).json({ message: 'Failed to fetch products.', error: error.message });
      }

      return res.status(200).json({ products: products || [] });

    } catch (error: any) {
      console.error('API error:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
