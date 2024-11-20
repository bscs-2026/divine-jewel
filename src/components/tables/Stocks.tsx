import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '@/components/styles/Table.module.css';
import { formatDate } from '@/lib/dateTimeHelper';

interface Stock {
  id: number;
  product_id: number;
  branch_code: number;
  quantity: number;
  damaged: number;
  product_name: string;
  branch_name: string | undefined;
  product_SKU: string;
  category_name: string;
  product_size: string;
  product_color?: string;
  last_updated: string;
}

interface Product {
  id: number;
  SKU: string;
  name: string;
  size: string;
  color: string;
  is_archive: number | boolean;
}

interface Branch {
  id: number;
  name: string;
  address_line: string;
}

interface StockTableProps {
  stocks: Stock[];
  stockSummary: { [key: number]: { [key: number]: number } } | null;
  selectedStocks: Stock[];
  setSelectedStocks: (stocks: Stock[]) => void;
  products: Product[];
  branches: Branch[];
}

const StockTable: React.FC<StockTableProps> = ({ stocks, stockSummary, selectedStocks, setSelectedStocks, products, branches }) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Stock; direction: 'asc' | 'desc' }>({
    key: 'product_name',
    direction: 'asc',
  });
  const [summarySortConfig, setSummarySortConfig] = useState<{ key: keyof Product | number; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Product Name', accessor: 'product_name' as keyof Stock, align: 'left' },
      { Header: 'SKU', accessor: 'product_SKU' as keyof Stock, align: 'left' },
      // { Header: 'Category', accessor: 'category_name' as keyof Stock, align: 'left' },
      { Header: 'Size', accessor: 'product_size' as keyof Stock, align: 'left' },
      { Header: 'Color', accessor: 'product_color' as keyof Stock, align: 'left' },
      { Header: 'Branch', accessor: 'branch_name' as keyof Stock, align: 'left' },
      // { Header: 'Address', accessor: 'branch_address' as keyof Stock, align: 'left' },
      { Header: 'Quantity', accessor: 'quantity' as keyof Stock, align: 'right' },
      { Header: 'Damaged', accessor: 'damaged' as keyof Stock, align: 'right' },
      { Header: 'Last Updated', accessor: 'last_updated' as keyof Stock, align: 'right' },
    ],
    []
  );

  // Define columns for Stock Summary table
  const summaryColumns = useMemo(
    () => [
      { Header: 'Product', accessor: 'name' as keyof Product, align: 'left' },
      { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left' },
      ...branches.map((branch) => ({
        Header: branch.name,
        accessor: branch.id as number, // Dynamic accessor for branch columns
        align: 'right',
      })),
    ],
    [branches]
  );

  // Handle sorting logic
  const sortedStocks = useMemo(() => {
    const sortedData = [...stocks];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? ''
      const valueB = b[sortConfig.key] ?? ''

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

  // Sort Stock Summary table
  const sortedStockSummary = useMemo(() => {
    if (!stockSummary) return [];

    const summaryData = products.map((product) => ({
      ...product,
      branches: branches.map((branch) => ({
        branchId: branch.id,
        quantity: stockSummary[product.id]?.[branch.id] || 0,
      })),
    }));

    summaryData.sort((a, b) => {
      const valueA =
        typeof summarySortConfig.key === 'number'
          ? a.branches.find((branch) => branch.branchId === summarySortConfig.key)?.quantity || 0
          : a[summarySortConfig.key] || '';
      const valueB =
        typeof summarySortConfig.key === 'number'
          ? b.branches.find((branch) => branch.branchId === summarySortConfig.key)?.quantity || 0
          : b[summarySortConfig.key] || '';

      if (valueA < valueB) return summarySortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return summarySortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return summaryData;
  }, [products, branches, stockSummary, summarySortConfig]);

    // Handle sorting in Stock Summary table
    const handleSummarySort = (key: keyof Product | number) => {
      let direction: 'asc' | 'desc' = 'asc';
      if (summarySortConfig.key === key && summarySortConfig.direction === 'asc') {
        direction = 'desc';
      }
      setSummarySortConfig({ key, direction });
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

  // Render sort icons for Stock Summary table
  const renderSummarySortIcon = (key: keyof Product | number) => {
    const isActive = summarySortConfig.key === key;
    return (
      <span>
        <ArrowUpward
          className={`${styles.sortIcon} ${isActive && summarySortConfig.direction === 'asc' ? styles.active : ''}`}
          style={{ fontSize: '16px' }}
        />
        <ArrowDownward
          className={`${styles.sortIcon} ${isActive && summarySortConfig.direction === 'desc' ? styles.active : ''}`}
          style={{ fontSize: '16px', marginLeft: '2px' }}
        />
      </span>
    );
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        {stockSummary ? (
          <thead>
          <tr>
            {summaryColumns.map((column) => (
              <th
                key={column.accessor as string}
                onClick={() => handleSummarySort(column.accessor)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sortContent}>
                  {column.Header}
                  {renderSummarySortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        ) : (
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
                  className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign
                    }`}
                >
                  <div className={`${styles.sortContent}`}>
                    {column.Header}
                    {renderSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
        )}

        <tbody>
          {stockSummary
            ? sortedStockSummary.map((product) => (
              <tr key={product.id} className={styles.tableRow}>
                <td className={styles.td}>{product.name}</td>
                <td className={styles.td}>{product.SKU || 'Unknown'}</td>
                {product.branches.map((branch) => (
                  <td key={branch.branchId} className={`${styles.td} ${styles.rightAlign}`}>
                    {branch.quantity}
                  </td>
                ))}
              </tr>
            ))
            : sortedStocks.map((stock) => (
              <tr
                key={stock.id}
                className={styles.tableRow}
                onClick={() => handleRowSelect(stock)}
                style={{ cursor: 'pointer' }}
              >
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
                <td className={`${styles.td} ${styles.rightAlign}`}>
                  {stock.quantity}
                </td>
                <td className={`${styles.td} ${styles.rightAlign}`}>
                  {stock.damaged}
                </td>
                <td className={`{styles.td} ${styles.rightAlign}`}>{formatDate(stock.last_updated, 'Asia/Manila')}</td>
              </tr>
            ))}
        </tbody>


      </table>
    </div>
  );
};

export default StockTable;