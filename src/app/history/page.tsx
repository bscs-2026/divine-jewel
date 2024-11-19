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
import ProductListOnHistory from '@/components/tables/ProductListOnHistory';
import ProductHistoryDetails from '@/components/modals/ProductHistoryDetails';

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

interface Product {
  id: number;
  SKU: string;
  category_id: number;
  category_name: string;
  name: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  quantity: number;
  is_archive: number | boolean;
}

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transaction' | 'stocks' | 'productHistory'>('stocks');
  const [stockDetailsGroup, setStockDetailsGroup] = useState<StockDetailGroup[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedBatchID, setSelectedBatchID] = useState<string | null>(null);
  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null);
  const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
  const [stockDetailsIndividual, setStockDetailsIndividual] = useState<StockDetailIndividual[]>([]);
  const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
  const [stockHistoryData, setStockHistoryData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Separate modal states for each tab
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isProductHistoryModalOpen, setIsProductHistoryModalOpen] = useState(false);

  useEffect(() => {
    if (selectedTab === 'stocks') {
      fetchStockDetailsGroup();
    } else if (selectedTab === 'transaction') {
      fetchOrders();
    } else if (selectedTab === 'productHistory') {
      fetchProducts();
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
    setIsStockModalOpen(true);
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
    setOrderDetails(data.orderDetails);
    setLoading(false);
  };

  const handleViewOrderAction = (order_id: number) => {
    setSelectedOrderID(order_id);
    fetchOrderDetails(order_id);
    setIsOrderModalOpen(true);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      // Process data to ensure all necessary fields are present
      const processedProducts = data.products.map((product: any) => ({
        ...product,
        category_name: product.category_name || '',
        stock: product.stock || 0,
      }));
      setProducts(processedProducts);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewStockHistory = async (productId: number) => {
    try {
      setLoading(true);

      // Fetch data from the three APIs
      const [stockHistoryRes, orderHistoryRes] = await Promise.all([
        fetch(`/api/products/${productId}/stockDetailsHistory`),
        fetch(`/api/products/${productId}/productOrderHistory`),
      ]);

      if (!stockHistoryRes.ok || !orderHistoryRes.ok) {
        throw new Error('Failed to fetch stock history data');
      }

      const [stockHistoryData, orderHistoryData] = await Promise.all([
        stockHistoryRes.json(),
        orderHistoryRes.json(),
      ]);

      // Process and standardize data
      const processedStockHistoryData = processStockHistoryData(stockHistoryData.stockHistory || []);
      const processedOrderHistoryData = processOrderHistoryData(orderHistoryData.orderHistory || []);

      // Combine and sort data by date
      const combinedData = [
        ...processedStockHistoryData,
        ...processedOrderHistoryData,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setStockHistoryData(combinedData);
      setIsProductHistoryModalOpen(true);
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Data processing functions
  const processStockHistoryData = (data: any[]) =>
    data.map(item => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.batch_id || '',
      source_branch: item.source_branch || '',
      destination_branch: item.destination_branch || '',
      employee: item.employee_name || '',
      reason: item.reason || '',
      note: item.note || '',
    }));

  const processOrderHistoryData = (data: any[]) =>
    data.map(item => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.order_id || '',
      source_branch: item.source_branch || '',
      destination_branch: '',
      employee: item.employee_name || '',
      reason: '',
      note: '',
    }));

  const handleViewProductHistory = (productId: number) => {
    setSelectedProductID(productId);
    viewStockHistory(productId);
  };

  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;
  const orderMetadata = orderDetails.length > 0 ? orderDetails[0] : null;

  return (
    <Layout defaultTitle="History">
      {loading && <CircularIndeterminate />}
      <div>
        <HistoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

        {selectedTab === 'stocks' && (
          <StockDetailsTable stockDetails={stockDetailsGroup} onViewAction={handleViewStockAction} />
        )}

        {selectedTab === 'transaction' && (
          <OrdersTable orders={orders} onViewAction={handleViewOrderAction} />
        )}

        {selectedTab === 'productHistory' && (
          <ProductListOnHistory products={products} onViewAction={handleViewProductHistory} />
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

        {/* Modal for Product History */}
        <Modal
          show={isProductHistoryModalOpen && selectedProductID !== null}
          onClose={() => setIsProductHistoryModalOpen(false)}
        >
          {selectedProductID && (
            <ProductHistoryDetails data={stockHistoryData} />
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default HistoryPage;
