import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '@/components/styles/Table.module.css';

interface Credit {
  id: number;
  customer_name: string;
  credit_amount: number | string;
  status: string;
}

interface CustomersCreditProps {
  credits: Credit[];
}

const CustomersCredit: React.FC<CustomersCreditProps> = ({ credits }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Credit; direction: 'asc' | 'desc' }>({
    key: 'id',
    direction: 'asc',
  });

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id' as keyof Credit, align: 'left', sortable: true },
      { Header: 'Customer Name', accessor: 'customer_name' as keyof Credit, align: 'left', sortable: true },
      { Header: 'Credit Amount', accessor: 'credit_amount' as keyof Credit, align: 'right', sortable: true },
      { Header: 'Status', accessor: 'status' as keyof Credit, align: 'left', sortable: true },
    ],
    []
  );

  const sortedCredits = useMemo(() => {
    const sortedData = [...credits];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? '';
      const valueB = b[sortConfig.key] ?? '';

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [credits, sortConfig]);

  const handleSort = (key: keyof Credit, sortable: boolean) => {
    if (!sortable) return;
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const renderSortIcon = (key: keyof Credit) => {
    const isActive = sortConfig.key === key;
    return (
      <span className={key === 'credit_amount' ? styles.sortIconsRight : styles.sortIconsLeft}>
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
                  {column.sortable && renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedCredits.map((credit) => (
            <tr key={credit.id} className={styles.tableRow}>
              <td className={styles.td}>{credit.id}</td>
              <td className={styles.td}>{credit.customer_name}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>
                {typeof credit.credit_amount === 'number'
                  ? credit.credit_amount.toFixed(2)
                  : parseFloat(credit.credit_amount || '0').toFixed(2)}
              </td>
              <td className={styles.td}>{credit.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomersCredit;
