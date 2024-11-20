import React, { useMemo, useState } from 'react';
import styles from '@/components/styles/Table.module.css';

interface Orders {
  order_id: number;
  order_date: string;
  branch_name: string;
  customer_name: string;
  quantity: number;
  total_unit_price: number | string;
  total_unit_price_deducted: number | string;
  mop: string;
  discount_percent: number;
  applied_credits: number;
  amount_tendered: number;
  amount_change: number;
  e_wallet_provider: string | null;
  reference_number: string | null;
}

interface RecentOrdersProps {
  Orderss: Orders[];
}

const RecentOrders: React.FC<RecentOrdersProps> = ({ Orderss }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Orders; direction: 'asc' | 'desc' }>({
    key: 'order_date',
    direction: 'desc', // Default to descending order
  });

  // Define table columns
  const columns = useMemo(
    () => [
      { Header: 'Order ID', accessor: 'order_id' as keyof Orders },
      { Header: 'Order Date', accessor: 'order_date' as keyof Orders },
      { Header: 'Branch Name', accessor: 'branch_name' as keyof Orders },
      { Header: 'Customer Name', accessor: 'customer_name' as keyof Orders },
      { Header: 'Quantity', accessor: 'quantity' as keyof Orders },
      { Header: 'Total Price', accessor: 'total_unit_price' as keyof Orders },
      { Header: 'Discount (%)', accessor: 'discount_percent' as keyof Orders },
      { Header: 'MOP', accessor: 'mop' as keyof Orders },
    ],
    []
  );

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sortedData = [...Orderss];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [Orderss, sortConfig]);

  // Handle sorting when a column header is clicked
  const handleSort = (key: keyof Orders) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor as string}
                onClick={() => handleSort(column.accessor)}
                className={styles.th}
              >
                {column.Header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order, index) => (
            <tr key={`${order.order_id}-${index}`}>
              <td>{order.order_id}</td>
              <td>{order.order_date}</td>
              <td>{order.branch_name}</td>
              <td>{order.customer_name}</td>
              <td>{order.quantity}</td>
              <td>₱{order.total_unit_price}</td>
              <td>{order.discount_percent}%</td>
              <td>{order.mop}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RecentOrders;
