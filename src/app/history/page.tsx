'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import OrdersTable from '../../components/tables/TransactionHistory';
import StockDetailsTable from '../../components/tables/StockDetailsHistory';
import HistoryTabs from '../../components/tabs/HistoryTabs';
import Modal from '../../components/modals/Modal';
import CircularIndeterminate from '@/components/loading/Loading';
import BatchStockDetailsHistory from '@/components/modals/BatchStockDetailsHistory';
import Receipt from '@/components/modals/Receipt'; 

interface StockDetailGroup {
  id: number;
  batch_id: string;
  date: string;
  action: string;
  source_branch_name: string | null;
  destination_branch_name: string | null;
  employee_fullname: string;
}

interface StockDetailIndividual {
  id: number;
  batch_id: string;
  date: string;
  action: string;
  note: string;
  source_branch_name: string | null;
  destination_branch_name: string | null;
  employee_fullname: string;
  product_name: string;
  product_sku: string;
  product_size: string;
  product_color: string;
  quantity: number;
}

interface Order {
  order_id: number;
  date: string;
  employee_name: string;
  subtotal_amount: string;
  discount_pct: string;
  applied_credits: string;
  total_amount: string;
  branch_name: string;

}

interface OrderDetail {
  order_id: number;
  order_date: string;
  branch_name: string;
  branch_address: string;
  customer_name: string;
  employee_fullname: string;
  product_name: string;
  sku: string | null;
  product_size: String | null;
  product_color: String | null;
  quantity: number;
  price: number | string;
  total_price: number | string;
  mop: string;
  discount_percent: number;
  applied_credits: number;
  total_amount: number;
  amount_tendered: number;
  amount_change: number;
  e_wallet_provider: string | null;
  reference_number: string | null;
}

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transaction' | 'stocks'>('stocks');
  const [stockDetailsGroup, setStockDetailsGroup] = useState<StockDetailGroup[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // State for orders
  const [selectedBatchID, setSelectedBatchID] = useState<string | null>(null);
  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null); // State for selected order
  const [stockDetailsIndividual, setStockDetailsIndividual] = useState<StockDetailIndividual[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  // Separate modal states for each tab
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    if (selectedTab === 'stocks') {
      fetchStockDetailsGroup();
    } else if (selectedTab === 'transaction') {
      fetchOrders();
    }
  }, [selectedTab]);

  const fetchStockDetailsGroup = async () => {
    setLoading(true);
    const response = await fetch('/api/history/stockDetailsGroup');
    const data = await response.json();
    setStockDetailsGroup(data.stockDetails);
    setLoading(false);
  };

  const fetchStockDetailsIndividual = async (batch_id: string) => {
    setLoading(true);
    const response = await fetch(`/api/history/${batch_id}/stockDetailsIndividual`);
    const data = await response.json();
    setStockDetailsIndividual(data.stockDetails);
    setLoading(false);
  };

  const handleViewStockAction = (batch_id: string) => {
    fetchStockDetailsIndividual(batch_id);
    setSelectedBatchID(batch_id);
    setIsStockModalOpen(true); // Open Stock Modal
  };

  const fetchOrders = async () => {
    setLoading(true);
    const response = await fetch('/api/history/orders');
    const data = await response.json();
    setOrders(data.orders);
    setLoading(false);
  };

  const fetchOrderDetails = async (order_id: number) => {
    setLoading(true);
    const response = await fetch(`/api/history/${order_id}/orderDetails`);
    const data = await response.json();
    setOrderDetails(data.orderDetails); // Store order details in state
    setLoading(false);
  };

  const handleViewOrderAction = (order_id: number) => {
    setSelectedOrderID(order_id);
    fetchOrderDetails(order_id);
    setIsOrderModalOpen(true);
  };  

  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;
  const orderMetadata = orderDetails.length > 0 ? orderDetails[0] : null;

  // Function to calculate total amount
  const calculateTotalAmount = (orderDetails: OrderDetail[]) => {
    return orderDetails.reduce((sum, detail) => sum + Number(detail.total_price), 0);
  };

  return (
    <Layout defaultTitle="History">
      {loading && (
        <CircularIndeterminate />
      )}
      <div>
        <HistoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedTab === 'stocks' && (
          <StockDetailsTable stockDetails={stockDetailsGroup} onViewAction={handleViewStockAction} />
        )}

        {selectedTab === 'transaction' && (
          <OrdersTable orders={orders} onViewAction={handleViewOrderAction} />
        )}

        {/* Modal for Stock Details */}
        <Modal show={isStockModalOpen && selectedBatchID !== null} onClose={() => setIsStockModalOpen(false)}>
          {selectedBatchID && stockMetadata && (
            <BatchStockDetailsHistory
              stockDetailsIndividual={stockDetailsIndividual}
              stockMetadata={stockMetadata}
            />
          )}
        </Modal>

        {/* Modal for Order Details */}
        <Modal show={isOrderModalOpen && selectedOrderID !== null} onClose={() => setIsOrderModalOpen(false)}>
        {selectedOrderID && orderMetadata && (
          <Receipt
            orderDetails={orderDetails}
            orderMetadata={orderMetadata}
          />
        )}
      </Modal>
      
      </div>
    </Layout>
  );
};

export default HistoryPage;
