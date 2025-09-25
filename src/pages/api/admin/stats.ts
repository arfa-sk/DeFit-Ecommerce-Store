import type { NextApiRequest, NextApiResponse } from 'next';
import { createAdminClient } from '@/lib/supabase';
import { parseCookies, isAdminAuthenticated } from '@/lib/auth';
import { AdminStats } from '@/types';

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
  if (!authenticated) return;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Fetch all orders
    const { data: orders, error: ordersError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersError) {
      console.error('Error fetching orders:', ordersError);
      return res.status(500).json({ message: 'Failed to fetch orders' });
    }

    // Fetch all products for low stock calculation
    const { data: products, error: productsError } = await supabaseAdmin
      .from('products')
      .select('stock')
      .lt('stock', 10); // Configurable threshold

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return res.status(500).json({ message: 'Failed to fetch products' });
    }

    // Calculate statistics
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const shippedOrders = orders.filter(order => order.status === 'shipped').length;
    const deliveredOrders = orders.filter(order => order.status === 'delivered').length;
    const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
    
    const totalRevenue = orders
      .filter(order => order.status !== 'cancelled')
      .reduce((sum, order) => sum + order.total, 0);
    
    const lowStockProducts = products.length;
    const recentOrders = orders.slice(0, 5);

    const stats: AdminStats = {
      totalOrders,
      pendingOrders,
      shippedOrders,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
      lowStockProducts,
      recentOrders
    };

    return res.status(200).json({ stats });

  } catch (error: any) {
    console.error('API error:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
