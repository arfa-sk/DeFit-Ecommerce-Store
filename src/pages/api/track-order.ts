import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase'; // Use client-side supabase for RLS

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { orderId } = req.query;
    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required.' });
    }

    try {
      // Set custom settings for RLS policy to work
      // This is a workaround for RLS policies that depend on session variables
      // A more robust solution for public tracking might involve a view or a function
      // that takes these parameters directly without relying on session context.
      // For this example, we'll simulate it by passing values.
      // In a real scenario, you might use a Supabase Function or a service role key
      // with specific query parameters if RLS is too restrictive.
      // For now, we'll query directly and rely on the policy if it's configured to allow it.

      let order = null as any;
      let error = null as any;
      const idParam = String(orderId);
      const isFullUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(idParam);

      if (isFullUuid) {
        const resp = await supabase
          .from('orders_public')
          .select('id, status, total, order_items, created_at')
          .eq('id', idParam)
          .single();
        order = resp.data;
        error = resp.error;
      } else {
        // Support short code prefix (first 8 chars) against a view that exposes id_text
        const resp = await supabase
          .from('orders_public')
          .select('id, status, total, order_items, created_at, id_text')
          .ilike('id_text', `${idParam}%`)
          .limit(1)
          .maybeSingle();
        order = resp.data;
        error = resp.error;
      }

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
