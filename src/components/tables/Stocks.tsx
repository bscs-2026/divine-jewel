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
  image_url: string;
}

interface Product {
  id: number;
  SKU: string;
  name: string;
  size: string;
  color: string;
  is_archive: number | boolean;
  image_url: string;
}

interface Branch {
  id: number;
  name: string;
  address_line: string;
  image_url: string;
}

interface StockTableProps {
  stocks: Stock[];
  stockSummary: { [key: number]: { [key: number]: number } } | null;
  filteredData: Product[];
  selectedStocks: Stock[];
  setSelectedStocks: (stocks: Stock[]) => void;
  products: Product[];
  branches: Branch[];
  onThumbnailClick: (imageUrl: string) => void;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, stockSummary, filteredData, selectedStocks, setSelectedStocks, products, branches, onThumbnailClick }) => {
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
      { Header: 'Image', accessor: 'image_url' as keyof Product, align: 'left', sortable: false },
      { Header: 'Product', accessor: 'product_name' as keyof Stock, align: 'left', sortable: true },
      { Header: 'SKU', accessor: 'product_SKU' as keyof Stock, align: 'left', sortable: true },
      { Header: 'Size', accessor: 'product_size' as keyof Stock, align: 'left', sortable: true },
      { Header: 'Color', accessor: 'product_color' as keyof Stock, align: 'left', sortable: true },
      { Header: 'Branch', accessor: 'branch_name' as keyof Stock, align: 'left', sortable: true },
      { Header: 'Quantity', accessor: 'quantity' as keyof Stock, align: 'right', sortable: true },
      { Header: 'Damaged', accessor: 'damaged' as keyof Stock, align: 'right', sortable: true },
      { Header: 'Last Updated', accessor: 'last_updated' as keyof Stock, align: 'right', sortable: true },
    ],
    []
  );

  // Define columns for Stock Summary table
  const summaryColumns = useMemo(
    () => [
      { Header: 'Image', accessor: 'image_url' as keyof Product, align: 'left', sortable: false },
      { Header: 'Product', accessor: 'name' as keyof Product, align: 'left', sortable: true },
      { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left', sortable: true },
      ...branches.map((branch) => ({
        Header: branch.name,
        accessor: branch.id as number,
        align: 'right',
        sortable: true,
      })),
    ],
    [branches]
  );

  // Sort stocks for the detailed view
  const sortedStocks = useMemo(() => {
    const dataToSort = [...stocks];
    dataToSort.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? '';
      const valueB = b[sortConfig.key] ?? '';

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return dataToSort;
  }, [stocks, sortConfig]);

  // Sort filteredData for the summary view
  const sortedFilteredData = useMemo(() => {
    const dataToSort = [...filteredData];
    dataToSort.sort((a, b) => {
      let valueA, valueB;

      // Check if sorting by a branch column
      if (typeof summarySortConfig.key === 'number') {
        const branchA = stockSummary[a.id]?.[summarySortConfig.key] || 0;
        const branchB = stockSummary[b.id]?.[summarySortConfig.key] || 0;
        valueA = branchA;
        valueB = branchB;
      } else {
        // Sorting by static columns like `name` or `SKU`
        valueA = a[summarySortConfig.key] ?? '';
        valueB = b[summarySortConfig.key] ?? '';
      }

      if (valueA < valueB) return summarySortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return summarySortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return dataToSort;
  }, [filteredData, summarySortConfig, stockSummary]);

  // Handle column header click for sorting
  const handleSort = (key: keyof Stock) => {
    const column = columns.find((col) => col.accessor === key);
    console.log(`handleSort called for column: ${key}, sortable: ${column?.sortable}`);
    if (!column?.sortable) return;

    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // const sortedStockSummary = useMemo(() => {
  //   if (!stockSummary) return [];

  //   const summaryData = products.map((product) => ({
  //     ...product,
  //     branches: branches.map((branch) => ({
  //       branchId: branch.id,
  //       quantity: stockSummary[product.id]?.[branch.id] || 0,
  //     })),
  //   }));

  //   summaryData.sort((a, b) => {
  //     const valueA =
  //       typeof summarySortConfig.key === 'number'
  //         ? a.branches.find((branch) => branch.branchId === summarySortConfig.key)?.quantity || 0
  //         : a[summarySortConfig.key] || '';
  //     const valueB =
  //       typeof summarySortConfig.key === 'number'
  //         ? b.branches.find((branch) => branch.branchId === summarySortConfig.key)?.quantity || 0
  //         : b[summarySortConfig.key] || '';

  //     if (valueA < valueB) return summarySortConfig.direction === 'asc' ? -1 : 1;
  //     if (valueA > valueB) return summarySortConfig.direction === 'asc' ? 1 : -1;
  //     return 0;
  //   });

  //   return summaryData;
  // }, [products, branches, stockSummary, summarySortConfig]);

  // Handle sorting in Stock Summary table
  const handleSummarySort = (key: keyof Product | number) => {
    const column = summaryColumns.find((col) => col.accessor === key);
    if (!column?.sortable) {
      console.log(`Column ${key} is not sortable.`);
      return; // Skip sorting if the column is not sortable
    }
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
    const column = columns.find((col) => col.accessor === key);
    if (!column?.sortable) return null;

    const isActive = sortConfig.key === key;
    return (
      <span className={`${styles.icon} ${key === 'quantity' ? styles.sortIconsRight : styles.sortIconsLeft}`} >
        <ArrowUpward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`}
          style={{ fontSize: '12px' }}
        />
        <ArrowDownward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}
          style={{ fontSize: '12px', marginLeft: '1px' }}
        />
      </span>
    );
  };

  // Render sort icons for Stock Summary table
  const renderSummarySortIcon = (key: keyof Product | number) => {
    const column = summaryColumns.find((col) => col.accessor === key);
    if (!column?.sortable) return null;

    const isActive = summarySortConfig.key === key;
    return (
      <span className={styles.icon}>
        <ArrowUpward
          className={`${styles.sortIcon} ${isActive && summarySortConfig.direction === 'asc' ? styles.active : ''}`}
          style={{ fontSize: '14px' }}
        />
        <ArrowDownward
          className={`${styles.sortIcon} ${isActive && summarySortConfig.direction === 'desc' ? styles.active : ''}`}
          style={{ fontSize: '14px', marginLeft: '2px' }}
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
                  onClick={() => column.sortable && handleSort(column.accessor)}
                  className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign} ${!column.sortable ? styles.nonSortable : ''
                    }`}
                >
                  <div className={`${styles.sortContent}`}>
                    {column.Header}
                    {column.sortable && renderSortIcon(column.accessor)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

        )}

        <tbody>
          {stockSummary
            ? sortedFilteredData.map((product) => (
              <tr key={product.id} className={styles.tableRow} style={{ cursor: 'default' }}>
                <td className={styles.td}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className={styles.thumbnail}
                      onClick={() => onThumbnailClick(product.image_url)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className={styles.td}>{product.name}</td>
                <td className={styles.td}>{product.SKU || 'N/A'}</td>
                {branches.map((branch) => (
                  <td
                    key={branch.id}
                    className={`${styles.td} ${styles.rightAlign}`}
                  >
                    {stockSummary[product.id]?.[branch.id] || 0}
                  </td>
                ))}
              </tr>
            ))
            : sortedStocks.map((stock) => (
              <tr
                key={stock.id}
                className={styles.tableRow}
                onClick={() => handleRowSelect(stock)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStocks.some((s) => s.id === stock.id)}
                    onChange={() => handleRowSelect(stock)}
                    aria-label={`Select row ${stock.id}`}
                  />
                </td>
                <td className={styles.td}>
                  {stock.image_url ? (
                    <img
                      src={stock.image_url}
                      alt={stock.product_name}
                      className={styles.thumbnail}
                      onClick={() => onThumbnailClick(stock.image_url)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <span>No Image</span>
                  )}
                </td>
                <td className={styles.td}>{stock.product_name}</td>
                <td className={styles.td}>{stock.product_SKU || 'N/A'}</td>
                <td className={styles.td}>{stock.product_size || 'N/A'}</td>
                <td className={styles.td}>{stock.product_color || 'N/A'}</td>
                <td className={styles.td}>{stock.branch_name || 'N/A'}</td>
                <td className={`${styles.td} ${styles.rightAlign}`}>
                  {stock.quantity}
                </td>
                <td className={`${styles.td} ${styles.rightAlign}`}>
                  {stock.damaged}
                </td>
                <td className={`${styles.td} ${styles.rightAlign}`}>
                  {formatDate(stock.last_updated, 'Asia/Manila')}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;