'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import styles from '@/components/styles/Modal.module.css';
import StockDetailsTable from '../../components/tables/StockDetailsHistory';
import HistoryTabs from '../../components/tabs/HistoryTabs';
import Modal from '../../components/modals/Modal';

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

const HistoryPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'transaction' | 'stocks'>('stocks');
  const [stockDetailsGroup, setStockDetailsGroup] = useState<StockDetailGroup[]>([]);
  const [selectedBatchID, setSelectedBatchID] = useState<string | null>(null);
  const [stockDetailsIndividual, setStockDetailsIndividual] = useState<StockDetailIndividual[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedTab === 'stocks') {
      fetchStockDetailsGroup();
    }
  }, [selectedTab]);

  const fetchStockDetailsGroup = async () => {
    const response = await fetch('/api/history/stockDetailsGroup');
    const data = await response.json();
    setStockDetailsGroup(data.stockDetails);
  };

  const fetchStockDetailsIndividual = async (batch_id: string) => {
    const response = await fetch(`/api/history/${batch_id}/stockDetailsIndividual`);
    const data = await response.json();
    setStockDetailsIndividual(data.stockDetails);
  };

  const handleViewAction = (batch_id: string) => {
    fetchStockDetailsIndividual(batch_id);
    setSelectedBatchID(batch_id);
    setIsModalOpen(true);
  };
  const stockMetadata = stockDetailsIndividual.length > 0 ? stockDetailsIndividual[0] : null;

  return (
    <Layout defaultTitle="History">
      <div>
        <HistoryTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        {selectedTab === 'stocks' && (
          <StockDetailsTable stockDetails={stockDetailsGroup} onViewAction={handleViewAction} />
        )}

        <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedBatchID && stockMetadata && (
            <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
              <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}> Stock Details</h2>
                <p><strong>Batch ID:</strong> {selectedBatchID}</p>
                <p><strong>Date:</strong> {new Date(stockMetadata.date).toLocaleDateString()}</p>
                <p><strong>Time:</strong> {new Date(stockMetadata.date).toLocaleTimeString()} </p>
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
                        SKU: {detail.product_sku} |   Size: {detail.product_size}  |   Color: {detail.product_color}
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

      </div>
    </Layout>
  );
};

export default HistoryPage;
