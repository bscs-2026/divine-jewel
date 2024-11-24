import React, { useMemo, useState, useEffect } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '@/components/styles/Table.module.css';
import { formatDate } from '@/lib/dateTimeHelper';
import { ErrorPrompt } from "@/components/prompts/Prompt";

interface Orders {
  order_id: number;
  order_date: string;
  customer_name: string;
  product_name: string;
  product_size: string;
  product_color: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  unit_price_deducted: number;
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
  const [sortConfig, setSortConfig] = useState<{ key: keyof Orders; direction: 'asc' | 'desc' }>({
    key: 'order_date',
    direction: 'desc',
  });

  const [errorSelect, setErrorSelect] = useState<boolean>(false);

  const columns = useMemo(
    () => [
      { Header: '✔', accessor: 'select' as keyof Orders, align: 'left', sortable: false },
      { Header: 'Order ID', accessor: 'order_id' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Order Date', accessor: 'order_date' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Customer', accessor: 'customer_name' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Product', accessor: 'product_name' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Size', accessor: 'product_size' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Color', accessor: 'product_color' as keyof Orders, align: 'left', sortable: true },
      { Header: 'Qty.', accessor: 'quantity' as keyof Orders, align: 'right', sortable: true },
      { Header: 'Unit Price', accessor: 'unit_price' as keyof Orders, align: 'right', sortable: true },
      { Header: 'Disc %', accessor: 'discount_percent' as keyof Orders, align: 'right', sortable: true },
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

  const handleSort = (key: keyof Orders, sortable: boolean) => {
    if (!sortable) return;
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };


  const handleRowSelect = (order: Orders) => {
    const isRowSelected = selectedOrders.some((o) => o.order_id === order.order_id);

    if (selectedOrders.length === 0 || isRowSelected) {
      // Toggle selection
      const alreadySelected = selectedOrders.some((o) => JSON.stringify(o) === JSON.stringify(order));
      if (alreadySelected) {
        // Deselect row
        setSelectedOrders(selectedOrders.filter((o) => JSON.stringify(o) !== JSON.stringify(order)));
      } else {
        // Add row
        setSelectedOrders([...selectedOrders, order]);
      }
    } else {
      setErrorSelect(true);
    }
  };

  const renderSortIcon = (key: keyof Orders) => {
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
            {columns.map((column) => (
              <th
                key={column.accessor as string}
                onClick={() => handleSort(column.accessor, column.sortable)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sortContent}>
                  {column.Header}
                  {column.sortable && renderSortIcon(column.accessor, column.sortable)}
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
              <td className={`${styles.td} ${styles.rightAlign}`}>{order.unit_price}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{order.discount_percent || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ErrorPrompt
        message="You can only select rows with the same Order ID."
        isVisible={errorSelect}
        onClose={() => setErrorSelect(false)}
      />
    </div>
  );
};

export default RecentOrders;
