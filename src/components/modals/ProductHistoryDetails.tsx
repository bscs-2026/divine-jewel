import React from 'react';
import styles from '../styles/Table.module.css';

interface StockHistoryItem {
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

interface StockHistoryTableProps {
  data: StockHistoryItem[];
}

const StockHistoryTable: React.FC<StockHistoryTableProps> = ({ data }) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.tableTitle}>Stock Movement History</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Date</th>
            <th className={styles.th}>Action</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Reference ID</th>
            <th className={styles.th}>Source Branch</th>
            <th className={styles.th}>Destination Branch</th>
            <th className={styles.th}>Employee</th>
            <th className={styles.th}>Reason</th>
            <th className={styles.th}>Note</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className={styles.td}>{new Date(item.date).toLocaleDateString()}</td>
              <td className={styles.td}>{item.action}</td>
              <td className={styles.td}>{item.quantity}</td>
              <td className={styles.td}>{item.reference_id}</td>
              <td className={styles.td}>{item.source_branch}</td>
              <td className={styles.td}>{item.destination_branch}</td>
              <td className={styles.td}>{item.employee}</td>
              <td className={styles.td}>{item.reason}</td>
              <td className={styles.td}>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockHistoryTable;
