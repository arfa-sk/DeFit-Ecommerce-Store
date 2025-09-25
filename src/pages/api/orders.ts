import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { OrderItem } from '@/types';

// Create admin client per request to avoid crashing at module load if env is missing

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabaseAdmin = createAdminClient();
  if (req.method === 'POST') {
    const { customer_name, customer_phone, customer_email, customer_address, order_items, total, payment_method } = req.body;

    // Basic validation
    if (!customer_name || !customer_phone || !customer_email || !customer_address || !order_items || order_items.length === 0 || total === undefined) {
      return res.status(400).json({ message: 'Missing required order details.' });
    }

    try {
      // 1. Create the order in Supabase
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          customer_name,
          customer_phone,
          customer_email,
          customer_address,
          order_items: order_items as OrderItem[], // Ensure type consistency
          total,
          payment_method,
          status: 'pending', // Default status
        })
        .select()
        .single();

      if (orderError) {
        console.error('Supabase order creation error:', orderError);
        return res.status(500).json({ message: 'Failed to place order.', error: orderError.message });
      }

      // 2. Update product stock (decrement)
      // This should ideally be done in a database transaction or a Supabase Edge Function for atomicity.
      // For this example, we'll do it sequentially.
      for (const item of order_items) {
        const { data: product, error: productFetchError } = await supabaseAdmin
          .from('products')
          .select('stock')
          .eq('id', item.product_id)
          .single();

        if (productFetchError || !product) {
          console.warn(`Product ${item.product_id} not found or error fetching stock:`, productFetchError);
          // Decide how to handle: rollback order, or just log and continue
          continue;
        }

        const newStock = product.stock - item.quantity;
        if (newStock < 0) {
          // This scenario should ideally be prevented earlier (e.g., in cart validation)
          console.error(`Attempted to over-sell product ${item.product_id}. Stock: ${product.stock}, Ordered: ${item.quantity}`);
          // You might want to rollback the order here or mark it as problematic
          return res.status(400).json({ message: `Not enough stock for ${item.name}.` });
        }

        const { error: stockUpdateError } = await supabaseAdmin
          .from('products')
          .update({ stock: newStock })
          .eq('id', item.product_id);

        if (stockUpdateError) {
          console.error(`Error updating stock for product ${item.product_id}:`, stockUpdateError);
          // Again, consider rollback or marking order as problematic
        }
      }

      // Email functionality removed - orders work without email confirmations

      return res.status(201).json({ 
        message: 'Order placed successfully! You can track your order using the Order ID.', 
        orderId: order.id 
      });

    } catch (error: any) {
      console.error('API error:', error);
      return res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
