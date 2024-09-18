// /components/tables/StockDetailsTable.tsx
import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '../styles/Table.module.css';

interface StockDetail {
  id: number;
  bacth_id: number;
  date: string;
  action: string;
  source_branch_name: string | null;
  destination_branch_name: string | null;
}

interface StockDetailsTableProps {
  stockDetails: StockDetail[];
}

const StockDetailsTable: React.FC<StockDetailsTableProps> = ({ stockDetails }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof StockDetail; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });

  const columns = useMemo(
    () => [
      { Header: 'Batch ID', accessor: 'bacth_id' as keyof StockDetail, align: 'left' },
      { Header: 'Date', accessor: 'date' as keyof StockDetail, align: 'left' },
      { Header: 'Action', accessor: 'action' as keyof StockDetail, align: 'left' },
      { Header: 'Source', accessor: 'source_branch_name' as keyof StockDetail, align: 'left' },
      { Header: 'Destination', accessor: 'destination_branch_name' as keyof StockDetail, align: 'left' },
      { Header: '', accessor: 'bacth_id' as keyof StockDetail, align: 'center' },
    ],
    []
  );

  const sortedStockDetails = useMemo(() => {
    const sortedData = [...stockDetails];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key] ?? '';
      const valueB = b[sortConfig.key] ?? '';
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [stockDetails, sortConfig]);


  const handleSort = (key: keyof StockDetail) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof StockDetail) => {
    const isActive = sortConfig.key === key;
    return (
      <span className={styles.sortIcons}>
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

  const handleViewAction = (id: number) => {
    // Handle the view action, e.g., open a modal with details
    // For now, we'll just log the batch ID
    console.log(`View details for batch ID: ${id}`);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor as string}


                onClick={() => column.accessor !== 'bacth_id' && handleSort(column.accessor)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sortContent}>
                  {column.Header}
                  {column.accessor !== 'bacth_id' && renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStockDetails.map((detail) => (
            <tr key={detail.bacth_id} className={styles.tableRow}>
              <td className={styles.td}>{detail.bacth_id}</td>
              <td className={styles.td}>{new Date(detail.date).toLocaleDateString()}</td>
              <td className={styles.td}>{detail.action}</td>
              <td className={styles.td}>{detail.source_branch_name || 'N/A'}</td>
              <td className={styles.td}>{detail.destination_branch_name || 'N/A'}</td>
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <button className={styles.viewButton} onClick={() => handleViewAction(detail.bacth_id)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockDetailsTable;
