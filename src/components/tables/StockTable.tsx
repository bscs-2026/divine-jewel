import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '../styles/Table.module.css';

interface Stock {
  id: number;
  product_id: number;
  branch_code: number;
  quantity: number;
  product_name: string;
  branch_name: string | undefined;
  product_SKU: string;
  product_size: string;
  product_color?: string;
}

interface StockTableProps {
  stocks: Stock[];
  selectedStocks: Stock[];
  setSelectedStocks: (stocks: Stock[]) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, selectedStocks, setSelectedStocks }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Stock; direction: 'asc' | 'desc' }>({
    key: 'product_name',
    direction: 'asc',
  });

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Product', accessor: 'product_name' as keyof Stock, align: 'left' },
      { Header: 'SKU', accessor: 'product_SKU' as keyof Stock, align: 'left' },
      { Header: 'Size', accessor: 'product_size' as keyof Stock, align: 'left' },
      { Header: 'Color', accessor: 'product_color' as keyof Stock, align: 'left' },
      { Header: 'Branch', accessor: 'branch_name' as keyof Stock, align: 'left' },
      // { Header: 'Address', accessor: 'branch_address' as keyof Stock, align: 'left' },
      { Header: 'Quantity', accessor: 'quantity' as keyof Stock, align: 'right' },
    ],
    []
  );

  // Handle sorting logic
  const sortedStocks = useMemo(() => {
    const sortedData = [...stocks];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [stocks, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key: keyof Stock) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Handle individual row selection
  const handleRowSelect = (stock: Stock) => {
    if (selectedStocks.find((s) => s.id === stock.id)) {
      setSelectedStocks(selectedStocks.filter((s) => s.id !== stock.id));
    } else {
      setSelectedStocks([...selectedStocks, stock]);
    }
  };

  // Handle "Select All" functionality
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedStocks([]);
    } else {
      setSelectedStocks(sortedStocks);
    }
    setSelectAll(!selectAll);
  };

  // Effect to update the "Select All" checkbox when all rows are selected/deselected
  useEffect(() => {
    if (selectedStocks.length === sortedStocks.length && sortedStocks.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedStocks, sortedStocks]);

  // Render sort icons with Material Icons
  const renderSortIcon = (key: keyof Stock) => {
    const isActive = sortConfig.key === key;
    return (
      <span className={key === 'quantity' ? styles.sortIconsRight : styles.sortIconsLeft}>
        <ArrowUpward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`}
          style={{ fontSize: '16px' }}
        />
        <ArrowDownward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}
          style={{ fontSize: '16px', marginLeft: '2px' }}
        />
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </th>
            {columns.map((column) => (
              <th
                key={column.accessor as string}
                onClick={() => handleSort(column.accessor)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={`${styles.sortContent}`}>
                  {column.Header}
                  {renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStocks.map((stock) => (
            <tr key={stock.id} className={styles.tableRow}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedStocks.some((s) => s.id === stock.id)}
                  onChange={() => handleRowSelect(stock)}
                  aria-label={`Select row ${stock.id}`}
                />
              </td>
              <td className={styles.td}>{stock.product_name}</td>
              <td className={styles.td}>{stock.product_SKU || 'Unknown'}</td>
              <td className={styles.td}>{stock.product_size || 'Unknown'}</td>
              <td className={styles.td}>{stock.product_color || 'Unknown'}</td>
              <td className={styles.td}>{stock.branch_name || 'Unknown'}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{stock.quantity}</td>
            </tr>
          ))}
        </tbody>


      </table>
    </div>
  );
};

export default StockTable;