import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward, Info, InfoOutlined } from '@mui/icons-material';
import styles from '../styles/Table.module.css';

interface StockDetailGroup {
  id: number;
  batch_id: string;
  date: string;
  action: string;
  source_branch_name: string | null;
  destination_branch_name: string | null;
  employee_fullname: string;
}

interface StockDetailsTableProps {
  stockDetails: StockDetailGroup[];
  onViewAction: (batch_id: string) => void;
}

const StockDetailsTable: React.FC<StockDetailsTableProps> = ({ stockDetails, onViewAction }) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof StockDetailGroup; direction: 'asc' | 'desc' }>({
    key: 'date',
    direction: 'desc',
  });

  const columns = useMemo(
    () => [
      { Header: 'Batch ID', accessor: 'batch_id' as keyof StockDetailGroup, align: 'left' },
      { Header: 'Date', accessor: 'date' as keyof StockDetailGroup, align: 'left' },
      { Header: 'Action', accessor: 'action' as keyof StockDetailGroup, align: 'left' },
      { Header: 'Source', accessor: 'source_branch_name' as keyof StockDetailGroup, align: 'left' },
      { Header: 'Destination', accessor: 'destination_branch_name' as keyof StockDetailGroup, align: 'left' },
      { Header: 'Employee', accessor: 'employee_fullname' as keyof StockDetailGroup, align: 'left' },
      { Header: '', accessor: 'batch_id' as keyof StockDetailGroup, align: 'center' },
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

  const handleSort = (key: keyof StockDetailGroup) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof StockDetailGroup) => {
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

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.accessor as string}
                onClick={() => column.accessor !== 'batch_id' && handleSort(column.accessor)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sortContent}>
                  {column.Header}
                  {column.accessor !== 'batch_id' && renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedStockDetails.map((detail) => (
            <tr 
            key={detail.batch_id} className={styles.tableRow}
            onClick={() => onViewAction(detail.batch_id)}
             >
              <td className={styles.td}>{detail.batch_id}</td>
              <td className={styles.td}>
                {new Date(detail.date).toLocaleDateString()}    {new Date(detail.date).toLocaleTimeString()}
              </td>
              <td className={styles.td}>{detail.action}</td>
              <td className={styles.td}>{detail.source_branch_name || 'N/A'}</td>
              <td className={styles.td}>{detail.destination_branch_name || 'N/A'}</td>
              <td className={styles.td}>{detail.employee_fullname}</td>
              <td className={styles.td} style={{ textAlign: 'center' }}>
                <InfoOutlined className={styles.viewButton} onClick={() => onViewAction(detail.batch_id)} />         
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockDetailsTable;
