//src/components/modals/BatchStockDetailsHistory.tsx
import React from 'react';
import styles from '@/components/styles/Modal.module.css';

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

interface StockDetailsProps {
  stockDetailsIndividual: StockDetailIndividual[];
  stockMetadata: StockDetailIndividual | null;
}

const StockDetails: React.FC<StockDetailsProps> = ({ stockDetailsIndividual, stockMetadata }) => {
  if (!stockMetadata) return null;

  return (
    <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Stock Details</h2>
        <p><strong>Batch ID:</strong> {stockMetadata.batch_id}</p>
        <p><strong>Date & Time:</strong> {new Date(stockMetadata.date).toLocaleDateString()}</p>
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
  );
};

export default StockDetails;
