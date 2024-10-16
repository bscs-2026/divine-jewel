'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import OrdersTable from '../../components/tables/TransactionHistory';
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

interface OrderDetail {
  order_id: number;
  order_date: string;
  branch_name: string;
  branch_address: string;
  customer_name: string;
  employee_fullname: string;
  product_name: string;
  quantity: number;
  price: number | string; // Updated to handle possible string type
  total_price: number | string; // Updated to handle possible string type
  mop: string;
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

  const fetchOrderDetails = async (order_id: number) => {
    const response = await fetch(`/api/history/${order_id}/orderDetails`);
    const data = await response.json();
    setOrderDetails(data.orderDetails); // Store order details in state
  };

  const handleViewStockAction = (batch_id: string) => {
    fetchStockDetailsIndividual(batch_id);
    setSelectedBatchID(batch_id);
    setIsStockModalOpen(true); // Open Stock Modal
  };

  const handleViewOrderAction = (order_id: number) => {
    setSelectedOrderID(order_id);
    fetchOrderDetails(order_id); // Fetch order details when an order is clicked
    setIsOrderModalOpen(true); // Open Order Modal
  };

  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;
  const orderMetadata = orderDetails.length > 0 ? orderDetails[0] : null;

  // Function to calculate total amount
  const calculateTotalAmount = (orderDetails: OrderDetail[]) => {
    return orderDetails.reduce((sum, detail) => sum + Number(detail.total_price), 0);
  };

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
                <p>
                  <strong>Batch ID:</strong> {selectedBatchID}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(stockMetadata.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(stockMetadata.date).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Source Branch:</strong> {stockMetadata.source_branch_name || 'N/A'}
                </p>
                <p>
                  <strong>Destination Branch:</strong> {stockMetadata.destination_branch_name || 'N/A'}
                </p>
                <p>
                  <strong>Employee:</strong> {stockMetadata.employee_fullname || 'N/A'}
                </p>
                <p>
                  <strong>Note:</strong> {stockMetadata.note || 'N/A'}
                </p>

                <br />
                <div className={styles.modalInputHeaderContainer}>
                  <span className={styles.modalInputLabel}>Qty.</span>
                </div>
                {stockDetailsIndividual.map((detail, index) => (
                  <div key={index} className={styles.modalItem}>
                    <div>
                      <p className={styles.modalPrimary}>{detail.product_name}</p>
                      <p className={styles.modalSecondary}>
                        SKU: {detail.product_sku} | Size: {detail.product_size} | Color:{' '}
                        {detail.product_color}
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
          {selectedOrderID && orderMetadata && (
            <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
              <div className={styles.modalContentScrollable}>

                <h2 className={styles.receiptSubHeading}>Divine Jewel</h2>
                
                <div className={styles.companyDetails}>
                  <h2>{orderMetadata.branch_name}</h2>
                  <h2>{orderMetadata.branch_address}</h2>
                </div>

                <p>
                  <strong>Order ID:</strong> {selectedOrderID}
                </p>
                <p>
                  <strong>Date:</strong> {new Date(orderMetadata.order_date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Time:</strong> {new Date(orderMetadata.order_date).toLocaleTimeString()}
                </p>
                <p>
                  <strong>Customer Name:</strong> {orderMetadata.customer_name || 'N/A'}
                </p>
                <p>
                  <strong>Employee Name:</strong> {orderMetadata.employee_fullname}
                </p>

                <table className={styles.receiptTable}>
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Qty.</th>
                      <th>Price</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.map((detail, index) => (
                      <tr key={index}>
                        <td>{detail.product_name}</td>
                        <td>{detail.quantity}</td>
                        <td>{Number(detail.price).toFixed(2)}</td>
                        <td>{Number(detail.total_price).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <br />

                <p>
                  <strong>Total:</strong> {calculateTotalAmount(orderDetails).toFixed(2)}
                </p>
                <p>
                  <strong>Amount Tendered:</strong> {orderMetadata.amount_tendered}
                </p>
                <p>
                  <strong>Change:</strong> {orderMetadata.amount_change}
                </p>

                <br />

                <p>
                  <strong>MOP:</strong> {orderMetadata.mop}
                </p>

                {orderMetadata.mop && orderMetadata.mop.toLowerCase() === 'e-wallet' && (
                  <>
                    <p>
                      <strong>E-Wallet Provider:</strong> {orderMetadata.e_wallet_provider || 'N/A'}
                    </p>
                    <p>
                      <strong>Reference Number:</strong> {orderMetadata.reference_number || 'N/A'}
                    </p>
                  </>
                )}

              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default HistoryPage;
