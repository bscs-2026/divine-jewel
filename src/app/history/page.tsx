'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import OrdersTable from '../../components/tables/TransactionHistory'; // Import OrdersTable
import StockDetailsTable from '../../components/tables/StockDetailsHistory';
import HistoryTabs from '../../components/tabs/HistoryTabs';
import Modal from '../../components/modals/Modal';
import styles from '@/components/styles/Modal.module.css';

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
  total_amount: string;
}

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transaction' | 'stocks'>('stocks');
  const [stockDetailsGroup, setStockDetailsGroup] = useState<StockDetailGroup[]>([]);
  const [orders, setOrders] = useState<Order[]>([]); // State for orders
  const [selectedBatchID, setSelectedBatchID] = useState<string | null>(null);
  const [selectedOrderID, setSelectedOrderID] = useState<number | null>(null); // State for selected order
  const [stockDetailsIndividual, setStockDetailsIndividual] = useState<StockDetailIndividual[]>([]);
  
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
    const response = await fetch('/api/history/stockDetailsGroup');
    const data = await response.json();
    setStockDetailsGroup(data.stockDetails);
  };

  const fetchOrders = async () => {
    const response = await fetch('/api/history/orders');
    const data = await response.json();
    setOrders(data.orders);
  };

  const fetchStockDetailsIndividual = async (batch_id: string) => {
    const response = await fetch(`/api/history/${batch_id}/stockDetailsIndividual`);
    const data = await response.json();
    setStockDetailsIndividual(data.stockDetails);
  };

  const handleViewStockAction = (batch_id: string) => {
    fetchStockDetailsIndividual(batch_id);
    setSelectedBatchID(batch_id);
    setIsStockModalOpen(true); // Open Stock Modal
  };

  const handleViewOrderAction = (order_id: number) => {
    setSelectedOrderID(order_id);
    setIsOrderModalOpen(true); // Open Order Modal
  };

  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;

  return (
    <Layout defaultTitle="History">
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
            <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
              <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Stock Details</h2>
                <p><strong>Batch ID:</strong> {selectedBatchID}</p>
                <p><strong>Date:</strong> {new Date(stockMetadata.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(stockMetadata.date).toLocaleTimeString()}</p>
                <p><strong>Source Branch:</strong> {stockMetadata.source_branch_name || 'N/A'}</p>
                <p><strong>Destination Branch:</strong> {stockMetadata.destination_branch_name || 'N/A'}</p>
                <p><strong>Employee:</strong> {stockMetadata.employee_fullname || 'N/A'}</p>
                <p><strong>Note:</strong> {stockMetadata.note || 'N/A'}</p>

                <br />
                <div className={styles.modalInputHeaderContainer}>
                  <span className={styles.modalInputLabel}>Qty.</span>
                </div>
                {stockDetailsIndividual.map((detail, index) => (
                  <div key={index} className={styles.modalItem}>
                    <div>
                      <p className={styles.modalPrimary}>{detail.product_name}</p>
                      <p className={styles.modalSecondary}>
                        SKU: {detail.product_sku} | Size: {detail.product_size} | Color: {detail.product_color}
                      </p>
                    </div>
                    <div>
                      <input
                        type="number"
                        name="quantity"
                        value={detail.quantity}
                        disabled
                        className={styles.modalInputFixed}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal>

        {/* Modal for Order Details */}
        <Modal show={isOrderModalOpen && selectedOrderID !== null} onClose={() => setIsOrderModalOpen(false)}>
          {selectedOrderID && (
            <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
              <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>Order Details</h2>
                <p><strong>Order ID:</strong> {selectedOrderID}</p>
              </div>
            </div>
          )}
        </Modal>

      </div>
    </Layout>
  );
};

export default HistoryPage;
