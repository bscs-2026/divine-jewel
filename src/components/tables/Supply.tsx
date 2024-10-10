import React, { useMemo, useState } from 'react';
import styles from '../styles/Table.module.css';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { formatDate } from '../../lib/helpers';

interface Supply {
  batch_id: string;
  supply_date: string;
  supplier_id: number;
  supplier_name: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
}

interface SupplyTableProps {
  supplies: Supply[];
  filterSupplier: number | string | null;
  fetchSupplyDetails: (batch_id: string) => void;
}

const SupplyTable: React.FC<SupplyTableProps> = ({
  supplies,
  filterSupplier,
  fetchSupplyDetails,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Supply; direction: 'asc' | 'desc' }>({
    key: 'supply_date',
    direction: 'desc',
  });

  const columns = useMemo(
    () => [
      { Header: 'Batch ID', accessor: 'batch_id' as keyof Supply, align: 'left' },
      { Header: 'Supply Date', accessor: 'supply_date' as keyof Supply, align: 'left' },
      { Header: 'Supplier', accessor: 'supplier_name' as keyof Supply, align: 'left' },
      { Header: 'Status', accessor: 'status' as keyof Supply, align: 'left' },
    ],
    []
  );

  const filteredSupplies = useMemo(() => {
    if (filterSupplier === null) {
      return supplies;
    }
    return supplies.filter((supply) => supply.supplier_id === filterSupplier);
  }, [supplies, filterSupplier]);

  const sortedSupplies = useMemo(() => {
    const sortedData = [...filteredSupplies];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [filteredSupplies, sortConfig]);

  const handleSort = (key: keyof Supply) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Supply) => {
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

  const handleRowClick = (batch_id: string) => {
    fetchSupplyDetails(batch_id);
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
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sorthContent}>
                  {column.Header}
                  {renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedSupplies.map((supply) => (
            <tr
              key={supply.batch_id}
              className={styles.borderT}
              onClick={() => handleRowClick(supply.batch_id)}
              style={{ cursor: 'pointer' }}
            >
              <td className={styles.td}>{supply.batch_id}</td>
              <td className={styles.td}>{formatDate(new Date().toISOString(), 'Asia/Singapore').split(' ')[0]}</td>
              <td className={styles.td}>{supply.supplier_name}</td>
              <td className={styles.td}>{supply.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyTable;
