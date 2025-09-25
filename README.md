# DeFit E-commerce Store

A modern, responsive e-commerce platform built with Next.js 14, Tailwind CSS, and Supabase.

## Features

- 🛍️ **Product Catalog**: Browse men's and women's clothing
- 🛒 **Shopping Cart**: Add products with size selection
- 📦 **Order Management**: Place orders and track status
- 👨‍💼 **Admin Panel**: Manage products and orders
- 📱 **Responsive Design**: Works on all devices
- 🎨 **Modern UI**: Clean, elegant design with animations

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd defit-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_PASSWORD=your_admin_password
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Supabase Setup

1. Create a new Supabase project
2. Run the following SQL to set up the database schema:

```sql
-- Create products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('men', 'women')),
  images TEXT[] DEFAULT '{}',
  stock INTEGER DEFAULT 0,
  sizes TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  order_items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'shipped', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create public view for order tracking
CREATE VIEW orders_public AS
SELECT 
  id,
  status,
  total,
  order_items,
  created_at,
  UPPER(LEFT(id::text, 8)) as id_text
FROM orders;

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Orders are viewable by everyone" ON orders FOR SELECT USING (true);
CREATE POLICY "Orders can be inserted by everyone" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Orders can be updated by service role" ON orders FOR UPDATE USING (true);
```

3. Set up Supabase Storage for product images
4. Add your environment variables to Vercel

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. Deploy!

### Environment Variables

Make sure to set these in your Vercel dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `ADMIN_PASSWORD`: Password for admin panel access

## Admin Panel

Access the admin panel at `/admin-login` with your admin password.

Features:
- View and manage products
- Update order statuses
- View order details
- Low stock alerts

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
