'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import CircularIndeterminate from '@/components/loading/Loading';
import RecentOrders from '@/components/tables/OrdersOnReturnItems';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface OrderDetail {
  order_id: number; // Ensure this is unique
  order_date: string;
  branch_name: string;
  customer_name: string;
  quantity: number;
  total_unit_price: number | string;
  total_unit_price_deducted: number | string;
  mop: string;
  discount_percent: number;
  applied_credits: number;
  amount_tendered: number;
  amount_change: number;
  e_wallet_provider: string | null;
  reference_number: string | null;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const branchId = getCookieValue('branch_id');
      const days = 3; // We only accept returns within 3 days from the time of purchase
      const response = await fetch(`/api/orders/data/${branchId}/${days}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Search by Order ID
  const filteredOrders = orders.filter(order =>
    order.order_id.toString().includes(searchQuery) // Compare Order ID as a string
  );

  return (
    <Layout defaultTitle="Return Items">
      {loading && <CircularIndeterminate />}
      {error && <p className="error">{error}</p>}

      <RecentOrders Orderss={filteredOrders} />
    </Layout>
  );
}
