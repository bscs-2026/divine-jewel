import React, { useMemo, useState } from 'react';
import styles from '../styles/Table.module.css';
import styles2 from '../styles/Button.module.css';
import { ArrowUpward, ArrowDownward, Edit, Delete} from '@mui/icons-material';

interface Supplier {
  id: number;
  supplier_name: string;
  contact_info?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

interface Supply {
  id: number;
  supply_date: string;
  supplier_id: number;
  sku?: string;
  material_name: string;
  quantity: number;
  unit_of_measure: string;
  price_per_unit: number;
  total_cost: number;
  destination_branch_id?: number;
  employee_id?: number;
  note?: string;
  status: 'pending' | 'delivered' | 'cancelled';
  // is_archive: number | boolean;
  [key: string]: any;
}

interface SupplyTableProps {
  supplies: Supply[];
  suppliers: Supplier[];
  filterSupplier: number | string | null;
  editSupply: (id: number) => void;
  deleteSupply: (id: number) => void;
}

const SupplyTable: React.FC<SupplyTableProps> = ({
  supplies,
  suppliers,
  filterSupplier,
  editSupply,
  deleteSupply,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Supply; direction: 'asc' | 'desc' }>({
    key: 'material_name',
    direction: 'asc',
  });

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Material', accessor: 'material_name' as keyof Supply, align: 'left' },
      { Header: 'Supplier', accessor: 'supplier_name' as keyof Supply, align: 'left' },
      { Header: 'SKU', accessor: 'sku' as keyof Supply, align: 'left' },
      { Header: 'Qty', accessor: 'quantity' as keyof Supply, align: 'right' },
      { Header: 'Unit', accessor: 'unit_of_measure' as keyof Supply, align: 'left' },
      { Header: 'Price', accessor: 'price_per_unit' as keyof Supply, align: 'right' },
      { Header: 'Total', accessor: 'total_cost' as keyof Supply, align: 'right' },
      { Header: 'Status', accessor: 'status' as keyof Supply, align: 'left' },
    ],
    []
  );

  // Define getSupplierName before using it
  const getSupplierName = (supplier_id: number) => {
    const supplier = suppliers.find((supplier) => supplier.id === supplier_id);
    return supplier ? supplier.supplier_name : '';
  };

  // Merge supplier_name into supplies
  const suppliesWithSupplierName = useMemo(() => {
    return supplies.map((supply) => ({
      ...supply,
      supplier_name: getSupplierName(supply.supplier_id),
    }));
  }, [supplies, suppliers]);

  // Handle sorting logic
  const sortedSupplies = useMemo(() => {
    const sortedData = [...suppliesWithSupplierName];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [suppliesWithSupplierName, sortConfig]);

  // Handle column header click for sorting
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
      <span
        className={
          key === 'price_per_unit' || key === 'quantity' || key === 'total_cost'
            ? styles.sortIconsRight
            : styles.sortIconsLeft
        }
      >
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

  const filteredSupplies = useMemo(() => {
    return filterSupplier
      ? sortedSupplies.filter((supply) => supply.supplier_id === filterSupplier)
      : sortedSupplies;
  }, [sortedSupplies, filterSupplier]);

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
            <th className={`${styles.th} ${styles.rightAlign}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSupplies.map((supply) => (
            <tr key={supply.id} className={styles.borderT}>
              <td className={styles.td}>{supply.material_name}</td>
              <td className={styles.td}>{supply.supplier_name}</td>
              <td className={styles.td}>{supply.sku || 'N/A'}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{supply.quantity}</td>
              <td className={styles.td}>{supply.unit_of_measure}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>
                ₱{Number(supply.price_per_unit).toFixed(2)}
              </td>
              <td className={`${styles.td} ${styles.rightAlign}`}>
                ₱{Number(supply.total_cost || 0).toFixed(2)}
              </td>
              <td className={styles.td}>{supply.status}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>
                <Edit
                  onClick={() => editSupply(supply.id)}
                  style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '1.5rem' }}
                  

                />

                <Delete         
                  onClick={(e) => {
                    e.preventDefault();
                    if (supply.id) {
                      deleteSupply(supply.id);
                    }
                  }}
                  style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '1.5rem' }}

                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyTable;
