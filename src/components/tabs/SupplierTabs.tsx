import React from 'react';
import styles from '../styles/Layout2.module.css';
import { AddBox } from '@mui/icons-material';

interface Supplier {
  id: number;
  supplier_name: string;
}

interface SupplierTabsProps {
  suppliers: Supplier[];
  filterSupplier: number | string | null;
  setFilterSupplier: (id: number | string | null) => void;
  handleAddSupply: () => void;
  toggleManageSuppliers: () => void;
}

const SupplierTabs: React.FC<SupplierTabsProps> = ({
  suppliers,
  filterSupplier,
  setFilterSupplier,
  handleAddSupply,
  toggleManageSuppliers,
}) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <button
          className={`${styles.tabsContainerItem} ${filterSupplier === null ? styles.active : styles.inactive}`}
          onClick={() => setFilterSupplier(null)}
        >
          All
        </button>
        {suppliers.map((supplier) => (
          <button
            key={supplier.id}
            className={`${styles.tabsContainerItem} ${filterSupplier === supplier.id ? styles.active : styles.inactive}`}
            onClick={() => setFilterSupplier(supplier.id)}
          >
            {supplier.supplier_name}
          </button>
        ))}
        <button
          className={`${styles.tabsContainerItem} ${styles.verticalLine}`}
          onClick={toggleManageSuppliers}
        >
          Manage Suppliers
        </button>
      </div>
      <div className={styles.rightButtonGroup}>
        <AddBox
          onClick={handleAddSupply}
          style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '2.5rem' }}
        />
      </div>
    </div>
  );
};

export default SupplierTabs;
