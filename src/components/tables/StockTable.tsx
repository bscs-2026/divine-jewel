import React from 'react';
import styles from '../styles/Table.module.css';
import styles2 from '../styles/Button.module.css';

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
  setSelectedStocks: (stock: Stock) => void;
  setIsTransfer: (isTransfer: boolean) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, setSelectedStocks, setIsTransfer }) => {
  const handleAddClick = (stock: Stock) => {
    setSelectedStocks(stock);
    setIsTransfer(false);
  };

  const handleTransferClick = (stock: Stock) => {
    setSelectedStocks(stock);
    setIsTransfer(true);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Branch</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.product_name}</td>
              <td>{stock.branch_name}</td>
              <td>{stock.quantity}</td>
              <td>
                <button
                  className={styles2.smallButton}
                  onClick={() => handleAddClick(stock)}
                >
                  Add
                </button>
                <button
                  className={styles2.smallButton}
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
