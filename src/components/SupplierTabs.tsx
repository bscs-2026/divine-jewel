import React from 'react';
import styles from './styles/Layout.module.css';

interface Supplier {
  id: number;
  supplier_name: string;
}

interface SupplierTabsProps {
  suppliers: Supplier[];
  filterSupplier: number | string | null;
  setFilterSupplier: (id: number | string | null) => void;
}

const SupplierTabs: React.FC<SupplierTabsProps> = ({
  suppliers,
  filterSupplier,
  setFilterSupplier,
}) => {
  return (
    <div className={styles.tabsContainer}>
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
    </div>
  );
};

export default SupplierTabs;
