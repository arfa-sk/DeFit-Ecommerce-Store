import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    try {
      const supabaseAdmin = createAdminClient();
      const idParam = String(orderId);
      const isFullUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idParam);

      let query;
      if (isFullUuid) {
        query = supabaseAdmin
          .from('orders_public')
          .select('id, status, total, order_items, created_at')
          .eq('id', idParam);
      } else {
        // Support short code prefix (first 8 chars) against a view that exposes id_text
        query = supabaseAdmin
          .from('orders_public')
          .select('id, status, total, order_items, created_at, id_text')
          .ilike('id_text', `${idParam.toUpperCase()}%`)
          .limit(1);
      }

      const { data: order, error } = await query.single();

      if (error || !order) {
        console.error('Order tracking error:', error);
        return res.status(404).json({ message: 'Order not found or credentials do not match.' });
      }

      return res.status(200).json({ order });

    } catch (error: any) {
      console.error('API error:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
