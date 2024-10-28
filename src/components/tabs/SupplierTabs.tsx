import React from 'react';
import styles from '../styles/Layout2.module.css';
import formStyles from '../styles/Form.module.css';
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
  const handleSupplierChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === 'null' ? null : parseInt(event.target.value);
    setFilterSupplier(value);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <label className={formStyles.heading} htmlFor="supplier-filter">
          Select Supplier:
        </label>
        <select
          className={formStyles.select}
          id="supplier-filter"
          value={filterSupplier === null ? 'null' : filterSupplier.toString()}
          onChange={handleSupplierChange}
        >
          <option value="null">All</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id.toString()}>
              {supplier.supplier_name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem} ${
            filterSupplier === 'manage' ? styles.active : styles.inactive
          }`}
          onClick={toggleManageSuppliers}
        >
          Manage Suppliers
        </button>

        <button
          className={`${styles.tabsContainerItem} ${
            filterSupplier === 'add' ? styles.active : styles.inactive
          }`}
          onClick={handleAddSupply}
        >
          Add Supply
        </button>
      </div>
    </div>
  );
};

export default SupplierTabs;
