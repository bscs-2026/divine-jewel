import React from 'react';
// import styles from '../styles/Table.module.css';
import styles from '../styles/Modal.module.css';

interface productHistoryData {
  date: string;
  action: string;
  quantity: number;
  reference_id: string;
  source_branch: string;
  destination_branch: string;
  employee: string;
  reason: string;
  note: string;
}

interface ProductHistoryDetailsProps {
  data: productHistoryData[];
  productName: string;
  productSKU: string;
}

const ProductHistoryDetails: React.FC<ProductHistoryDetailsProps> = ({ data, productName, productSKU }) => {
  return (
    <div className={styles.largeModalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Product Stock History</h2>
        <div className={styles.modalSubHeading}>
          <p><strong>Product: </strong>{productName}</p>
          <p><strong>SKU: </strong>{productSKU}</p>
        </div>

        <table className={styles.modalTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Quantity</th>
              <th>Reference ID</th>
              <th>Source Branch</th>
              <th>Destination Branch</th>
              <th>Employee</th>
              <th>Reason</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.date).toLocaleDateString()}</td>
                <td>{item.action}</td>
                <td>{item.quantity}</td>
                <td>{item.reference_id}</td>
                <td>{item.source_branch}</td>
                <td>{item.destination_branch}</td>
                <td>{item.employee}</td>
                <td>{item.reason}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductHistoryDetails;
