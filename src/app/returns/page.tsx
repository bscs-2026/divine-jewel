'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Spinner from '@/components/loading/Loading';
import RecentOrders from '@/components/tables/OrdersOnReturnItems';
import ReturnItemsTabs from '@/components/tabs/ReturnItems';
import { SuccessfulPrompt } from '@/components/prompts/Prompt';
import { getCookieValue } from '@/lib/clientCookieHelper';
import styles from '@/components/styles/Filter.module.css';

interface OrderDetail {
  order_id: number;
  product_id: number;
  product_name: string;
  product_size: string;
  product_color: string;
  product_sku: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  unit_price_deducted: number;
  customer_name: string;
  branch_name: string;
  branch_address: string;
}

interface CustomerCredit {
  id: number;
  customer_name: string;
  credit_amount: number;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDetail[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>([]);
  const [credits, setCredits] = useState<CustomerCredit[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<OrderDetail[]>([]);
  const [successReturnPrompt, setSuccessReturnPrompt] = useState(false);
  const [userBranchName, setUserBranchName] = useState<string | null>(null);

  useEffect(() => {
    const branch = getCookieValue('branch_name');
    setUserBranchName(branch);
  }, []);

  useEffect(() => {
    fetchOrders();
    fetchCredits();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const branchId = getCookieValue('branch_id');
      const days = 3;
      const response = await fetch(`/api/orders/data/${branchId}/${days}`);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.data);
      setFilteredOrders(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCredits = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/credits`);
      if (!response.ok) throw new Error('Failed to fetch credits');
      const data = await response.json();
      setCredits(data.data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredOrders(
      orders.filter((order) =>
        order.order_id.toString().toLowerCase().includes(query)
      )
    );
  }, [searchQuery, orders]);

  const handleReturnItems = async (item, returnQuantity, note) => {
    const employeeId = getCookieValue('user_id');
    const customerName = selectedOrders[0]?.customer_name || null;

    try {
      const payload = {
        orderId: item.order_id,
        returnItems: [{ product_id: item.product_id, quantity: returnQuantity, note }],
        employeeId,
        customerName,
      };

      const response = await fetch('/api/orders/return', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        return { ok: false, message: `API error: ${response.statusText}` };
      }

      const result = await response.json();
      return {
        ok: true,
        message: result.message,
        creditId: result.creditId,
        totalCredits: result.totalCreditAmount,
      };
    } catch (error) {
      console.error('Error during API call:', error);
      return { ok: false, message: error.message || 'Unexpected error occurred.' };
    }
  };

  return (
    <Layout defaultTitle="Return Items">
      {loading && <Spinner />}
      {error && <p className="error-message">{error}</p>}
      <div>
        <p className={styles.secondaryHeading}>
          <strong>{userBranchName}</strong>
        </p>
      </div>
      <ReturnItemsTabs
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search orders ID"
        selectedOrders={selectedOrders}
        credits={credits}
        returnItem={handleReturnItems}
      />
      <RecentOrders
        Orderss={filteredOrders}
        selectedOrders={selectedOrders}
        setSelectedOrders={setSelectedOrders}
      />
      <SuccessfulPrompt
        message="Items successfully returned!"
        isVisible={successReturnPrompt}
        onClose={() => setSuccessReturnPrompt(false)}
      />
    </Layout>
  );
}
