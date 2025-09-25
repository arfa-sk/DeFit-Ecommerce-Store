export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
  sizes: string[];
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string; // Product ID
  name: string;
  price: number;
  image: string; // Main image URL
  size: string;
  quantity: number;
}

export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
}

export type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  customer_address: string;
  order_items: OrderItem[];
  total: number;
  payment_method: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  status_history?: OrderStatusUpdate[];
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  updated_at: string;
  updated_by?: string;
  notes?: string;
}

export interface AdminStats {
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  lowStockProducts: number;
  recentOrders: Order[];
}

export interface OrderFilters {
  search: string;
  status: OrderStatus | 'all';
  dateFrom: string;
  dateTo: string;
  minAmount: number;
  maxAmount: number;
}
