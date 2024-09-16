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
}

const SupplierTabs: React.FC<SupplierTabsProps> = ({
  suppliers,
  filterSupplier,
  setFilterSupplier,
  handleAddSupply
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

<div className={styles.rightButtonGroup}>
        <AddBox
          onclick={handleAddSupply}
          style={{ cursor: 'pointer', color: '#575757', marginRight: '5px', fontSize: '2.5rem' }}
        />


        {/* <button
          className={`${styles.tabsContainerItem}`}
          onClick={handleAddProduct}
        >
          Add
        </button> */}

      </div>
    </div>
  );
};

export default SupplierTabs;
