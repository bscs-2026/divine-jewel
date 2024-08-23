import React from 'react';
import styles from './styles/Table.module.css';
import styles2 from './styles/Button.module.css';

interface Stock {
  id: number;
  product_id: number;
  branch_code: number;
  quantity: number;
  product_name: string;
  branch_name: string;
}

interface StockTableProps {
  stocks: Stock[];
  setSelectedStock: (stock: Stock) => void;
  setIsTransfer: (isTransfer: boolean) => void;
}

const StockTable: React.FC<StockTableProps> = ({ 
    stocks,
    setSelectedStock,
    setIsTransfer }) => {
    
        const handleAddClick = (stock: Stock) => {
            setSelectedStock(stock);
            console.log('Selected Stock:', stock);
            setIsTransfer(false); 
        };
    
        const handleTransferClick = (stock: Stock) => {
            setSelectedStock(stock);
            console.log('Selected Stock:', stock);
            setIsTransfer(true); 
        };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Product</th>
            <th className={styles.th}>Branch</th>
            <th className={styles.th}>Quantity</th>
            <th className={styles.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id} className={styles.borderT}>
              <td className={styles.td}>{stock.product_name}</td>
              <td className={styles.td}>{stock.branch_name}</td>
              <td className={styles.td}>{stock.quantity}</td>
              <td className={styles.td}>
                <button
                  className={`${styles2.smallButton} ${styles2.editButton}`}
                  onClick={() => handleAddClick(stock)}
                >
                  Add
                </button>
                <button
                  className={`${styles2.smallButton} ${styles2.editButton}`}
                  onClick={() => handleTransferClick(stock)}
                >
                  Transfer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
