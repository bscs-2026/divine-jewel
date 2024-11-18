'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Spinner from '@/components/loading/Loading';
import RecentOrders from '@/components/tables/OrdersOnReturnItems';
import ReturnItems from '@/components/tabs/ReturnItems';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface OrderDetail {
  order_id: number;
  order_date: string;
  customer_name: string;
  product_name: string;
  product_size: string;
  product_color: string;
  quantity: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<OrderDetail[]>([]);

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

  const filteredOrders = orders.filter(order =>
    order.order_id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout defaultTitle="Return Items">
      {loading && <Spinner />}
      {error && <p>{error}</p>}

      <ReturnItems
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search Order ID"
        selectedOrders={selectedOrders} // Pass selected orders
      />

      <RecentOrders
        Orderss={filteredOrders}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
      />
    </Layout>
  );
}
