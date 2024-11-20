'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import Spinner from '@/components/loading/Loading';
import RecentOrders from '@/components/tables/OrdersOnReturnItems';
import ReturnItemsTabs from '@/components/tabs/ReturnItems';
import { SuccessfulPrompt } from '@/components/prompts/Prompt';
import { getCookieValue } from '@/lib/clientCookieHelper';

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

export default function OrdersPage() {
    const [orders, setOrders] = useState<OrderDetail[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<OrderDetail[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<OrderDetail[]>([]);
    const [successReturnPrompt, setSuccessReturnPrompt] = useState(false);

    useEffect(() => {
        fetchOrders();
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
        const employeeName = getCookieValue('first_name') + ' ' + getCookieValue('last_name');
        const customerName = selectedOrders[0]?.customer_name || null;
        const branchName = selectedOrders[0]?.branch_name || getCookieValue('branch_name');
        const branchAddress = selectedOrders[0]?.branch_address || 'Unknown Address';

      try {
          const payload = {
              orderId: item.order_id,
              returnItems: [{ product_id: item.product_id, quantity: returnQuantity, note }],
              employeeId,
              employeeName,
              customerName,
              branchName,
              branchAddress,
          };
  
          console.log("Submitting payload to API:", JSON.stringify(payload, null, 2));
  
          const response = await fetch('/api/orders/return', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
          });
  
          console.log("Response status:", response.status);
          if (!response.ok) {
              const errorText = await response.text();
              console.error("API error response:", errorText);
              return { ok: false, message: `API error: ${response.statusText}` };
          }
  
          const result = await response.json();
          console.log("API response parsed:", result);
  
          // Set successReturnPrompt to true on success
          setSuccessReturnPrompt(true);
  
          return result && result.message
              ? { ok: true, message: result.message }
              : { ok: false, message: "Unexpected API response format." };
      } catch (error) {
          console.error("Error during API submission:", error);
          return { ok: false, message: error.message || "Unexpected error during API call." };
      }
  };
  

    return (
        <Layout defaultTitle="Return Items">
            {loading && <Spinner />}
            {error && <p className="error-message">{error}</p>}

            <ReturnItemsTabs
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search orders ID"
                selectedOrders={selectedOrders}
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
