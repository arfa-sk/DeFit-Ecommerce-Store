import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { OrderStatus } from '@/types';
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
        const { data: orders, error } = await supabaseAdmin
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Supabase fetch orders error:', error);
          return res.status(500).json({ message: 'Failed to fetch orders.', error: error.message });
        }
        return res.status(200).json({ orders });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    case 'PUT':
      try {
        const { id } = req.query;
        const { status } = req.body;

        if (!id || !status) {
          return res.status(400).json({ message: 'Order ID and new status are required for update.' });
        }

        // Validate status against ENUM values
        const validStatuses: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
          return res.status(400).json({ message: `Invalid status provided. Must be one of: ${validStatuses.join(', ')}` });
        }

        const { data, error } = await supabaseAdmin
          .from('orders')
          .update({ status: status as OrderStatus })
          .eq('id', id as string)
          .select()
          .single();

        if (error) {
          console.error('Supabase update order status error:', error);
          return res.status(500).json({ message: 'Failed to update order status.', error: error.message });
        }
        return res.status(200).json({ message: 'Order status updated successfully!', order: data });
      } catch (error: any) {
        console.error('API error:', error);
        return res.status(500).json({ message: 'Internal server error.', error: error.message });
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
