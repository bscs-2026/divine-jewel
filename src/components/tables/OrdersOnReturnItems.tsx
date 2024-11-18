import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '@/components/styles/Table.module.css';
import { formatDate } from '@/lib/dateTimeHelper';

interface Orders {
  order_id: number;
  order_date: string;
  customer_name: string;
  product_name: string;
  product_size: string;
  product_color: string;
  quantity: number;
}

interface RecentOrdersProps {
  Orderss: Orders[];
  selectedOrders: Orders[];
  setSelectedOrders: (orders: Orders[]) => void;
}

const RecentOrders: React.FC<RecentOrdersProps> = ({
  Orderss = [],
  selectedOrders = [],
  setSelectedOrders,
}) => {
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Orders; direction: 'asc' | 'desc' }>({
    key: 'order_date',
    direction: 'desc',
  });

  const columns = useMemo(
    () => [
      { Header: 'Order ID', accessor: 'order_id' as keyof Orders, align: 'left' },
      { Header: 'Order Date', accessor: 'order_date' as keyof Orders, align: 'left' },
      { Header: 'Customer Name', accessor: 'customer_name' as keyof Orders, align: 'left' },
      { Header: 'Product Name', accessor: 'product_name' as keyof Orders, align: 'left' },
      { Header: 'Size', accessor: 'product_size' as keyof Orders, align: 'left' },
      { Header: 'Color', accessor: 'product_color' as keyof Orders, align: 'left' },
      { Header: 'Quantity', accessor: 'quantity' as keyof Orders, align: 'right' },
    ],
    []
  );

  const sortedOrders = useMemo(() => {
    const sortedData = [...Orderss];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? '';
      const valueB = b[sortConfig.key] ?? '';

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [Orderss, sortConfig]);

  const handleSort = (key: keyof Orders) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleRowSelect = (order: Orders) => {
    // Create a unique identifier for the row (e.g., composite key)
    const uniqueRowIdentifier = JSON.stringify(order);

    // Check if the row is already selected
    const isRowSelected = selectedOrders.some(
      (o) => JSON.stringify(o) === uniqueRowIdentifier
    );

    if (isRowSelected) {
      // Remove the row if it's already selected
      setSelectedOrders(
        selectedOrders.filter((o) => JSON.stringify(o) !== uniqueRowIdentifier)
      );
    } else {
      // Add the row if it's not selected
      setSelectedOrders([...selectedOrders, order]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sortedOrders);
    }
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    if (
      selectedOrders?.length === sortedOrders?.length &&
      sortedOrders?.length > 0
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedOrders, sortedOrders]);

  const renderSortIcon = (key: keyof Orders) => {
    const isActive = sortConfig.key === key;
    return (
      <span className={key === 'quantity' ? styles.sortIconsRight : styles.sortIconsLeft}>
        <ArrowUpward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`}
        />
        <ArrowDownward
          className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}
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
                <div className={styles.sortContent}>
                  {column.Header}
                  {renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, index) => (
            <tr
              key={`${order.order_id}-${index}`}
              className={styles.tableRow}
              onClick={() => handleRowSelect(order)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                <input
                  type="checkbox"
                  checked={selectedOrders.some(
                    (o) => JSON.stringify(o) === JSON.stringify(order)
                  )}
                  onChange={() => handleRowSelect(order)}
                  aria-label={`Select row ${order.order_id}`}
                />
              </td>
              <td className={styles.td}>{order.order_id}</td>
              <td className={styles.td}>{formatDate(order.order_date, 'Asia/Manila')}</td>
              <td className={styles.td}>{order.customer_name || 'N/A'}</td>
              <td className={styles.td}>{order.product_name || 'N/A'}</td>
              <td className={styles.td}>{order.product_size || 'N/A'}</td>
              <td className={styles.td}>{order.product_color || 'N/A'}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{order.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
