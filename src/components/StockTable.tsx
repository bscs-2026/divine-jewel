import React from 'react';
import styles from './styles/Table.module.css';
import styles2 from './styles/Button.module.css';

interface Stock {
  id: number;
  product_name: string;
  branch_name: string;
  stock: number;
}

interface Branch {
  id: number;
  address_line: string;
}

interface StockTableProps {
  stocks: Stock[];
  branches: Branch[];
  selectedBranch: string | null;
  setSelectedBranch: (branch: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, branches, selectedBranch, setSelectedBranch }) => {
  return (
    <div className={styles.container}>
      {/* <div>
        <label htmlFor='branch'>Branch:</label>
        <select
          name='branch'
          id='branch'
          value={selectedBranch || ''}
          onChange={(e) => setSelectedBranch(e.target.value)}
        >
          <option value=''>All Branches</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.address_line}
            </option>
          ))}
        </select>
      </div> */}

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Stock ID</th>
            <th className={styles.th}>Product</th>
            <th className={styles.th}>Branch</th>
            <th className={styles.th}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id} className={styles.borderT}>
              <td className={styles.td}>{stock.id}</td>
              <td className={styles.td}>{stock.product_name}</td>
              <td className={styles.td}>{stock.branch_name}</td>
              <td className={styles.td}>{stock.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
