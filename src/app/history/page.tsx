'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import OrdersTable from '../../components/tables/TransactionHistory';
import StockDetailsTable from '../../components/tables/StockDetailsHistory';
import HistoryTabs from '../../components/tabs/HistoryTabs';
import Modal from '../../components/modals/Modal';
import LargeModal from '../../components/modals/LargeModal';
import CircularIndeterminate from '@/components/loading/Loading';
import BatchStockDetailsHistory from '@/components/modals/BatchStockDetailsHistory';
import ProductListOnHistory from '@/components/tables/ProductListOnHistory';
import ProductHistoryDetails from '@/components/modals/ProductHistoryDetails';
import Receipt from '@/components/modals/OrderReceipt';

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transaction' | 'stocks' | 'productHistory'>('stocks');
  const [stockDetailsGroup, setStockDetailsGroup] = useState([]);
  const [stockDetailsIndividual, setStockDetailsIndividual] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const [products, setProducts] = useState([]);
  const [productHistoryData, setProductHistoryData] = useState([]);
  const [selectedBatchID, setSelectedBatchID] = useState<string | null>(null);
  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null);
  const [selectedProductID, setSelectedProductID] = useState<number | null>(null);
  const [selectedProductName, setSelectedProductName] = useState<string>('');
  const [selectedProductSKU, setSelectedProductSKU] = useState<string>('');
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isProductHistoryModalOpen, setIsProductHistoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch the initial data based on the selected tab
  useEffect(() => {
    if (selectedTab === 'stocks') {
      fetchStockDetailsGroup();
    } else if (selectedTab === 'transaction') {
      fetchOrders();
    } else if (selectedTab === 'productHistory') {
      fetchProducts();
    }
  }, [selectedTab]);

  // Fetch stock group details
  const fetchStockDetailsGroup = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/history/stockDetailsGroup');
      const data = await response.json();
      setStockDetailsGroup(data.stockDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stock details for a specific batch
  const fetchStockDetailsIndividual = async (batch_id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history/${batch_id}/stockDetailsIndividual`);
      const data = await response.json();
      setStockDetailsIndividual(data.stockDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewStockAction = (batch_id: string) => {
    fetchStockDetailsIndividual(batch_id);
    setSelectedBatchID(batch_id);
    setIsStockModalOpen(true);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/history/orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (order_id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history/${order_id}/orderDetails`);
      const data = await response.json();
      setOrderDetails(data.orderDetails);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const viewProductHistory = async (productId: number) => {
    setLoading(true);
    try {
      const [stockHistoryRes, orderHistoryRes] = await Promise.all([
        fetch(`/api/products/${productId}/stockDetailsHistory`),
        fetch(`/api/products/${productId}/productOrderHistory`),
      ]);

      const [productHistoryData, orderHistoryData] = await Promise.all([
        stockHistoryRes.json(),
        orderHistoryRes.json(),
      ]);

      const combinedData = [
        ...processProductHistoryData(productHistoryData.stockHistory || []),
        ...processOrderHistoryData(orderHistoryData.orderHistory || []),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setProductHistoryData(combinedData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setIsProductHistoryModalOpen(true);
    }
  };

  const handleViewProductHistory = (productId: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedProductName(product.name);
      setSelectedProductSKU(product.SKU);
    }
    setSelectedProductID(productId);
    viewProductHistory(productId);
  };

  const processProductHistoryData = (data: any[]) =>
    data.map((item) => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.batch_id || '',
      employee: item.employee_name || '',
      note: item.note || '',
    }));

  const processOrderHistoryData = (data: any[]) =>
    data.map((item) => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.order_id || '',
      employee: item.employee_name || '',
    }));

  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;
  const orderMetadata = orderDetails.length > 0 ? orderDetails[0] : null;

  return (
    <Layout defaultTitle="History">
      {loading && <CircularIndeterminate />}
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

      {/* Modals */}
      <Modal show={isStockModalOpen} onClose={() => setIsStockModalOpen(false)}>
        {selectedBatchID && stockMetadata && (
          <BatchStockDetailsHistory stockDetailsIndividual={stockDetailsIndividual} stockMetadata={stockMetadata} />
        )}
      </Modal>

      <Modal show={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)}>
        {selectedOrderID && orderMetadata && (
          <Receipt orderDetails={orderDetails} orderMetadata={orderMetadata} />
        )}
      </Modal>

      <LargeModal show={isProductHistoryModalOpen} onClose={() => setIsProductHistoryModalOpen(false)}>
        {selectedProductID && (
          <ProductHistoryDetails
            data={productHistoryData}
            productName={selectedProductName}
            productSKU={selectedProductSKU}
          />
        )}
      </LargeModal>
    </Layout>
  );
};

export default HistoryPage;
