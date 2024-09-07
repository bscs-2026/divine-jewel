// src/components/SupplyTable.tsx

import React from 'react';
import styles from '../styles/Table.module.css';
import styles2 from '../styles/Button.module.css';

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
  price_per_unit: string | number;
  total_cost: number;
  destination_branch_id?: number;
  employee_id?: number;
  note?: string;
  status: 'pending' | 'delivered' | 'cancelled';
  is_archive: number | boolean;
}

interface SupplyTableProps {
  supplies: Supply[];
  suppliers: Supplier[];
  filterSupplier: number | string | null;
  editSupply: (supply: Supply) => void;
  deleteSupply: (id: number) => void;
}

const SupplyTable: React.FC<SupplyTableProps> = ({
  supplies,
  suppliers,
  filterSupplier,
  editSupply,
  deleteSupply,
  setActiveTab, // Make sure this is passed in as a prop
}) => {
  const filteredSupplies = filterSupplier
    ? supplies.filter((supply) => supply.supplier_id === filterSupplier)
    : supplies;

  const getSupplierName = (supplier_id: number) => {
    const supplier = suppliers.find((supplier) => supplier.id === supplier_id);
    return supplier ? supplier.supplier_name : '';
  };

  const handleEditClick = (supply: Supply) => {
    setActiveTab('supplies'); // Switch to the Add/Edit Supply tab
    editSupply(supply.id);    // Pass the correct ID to the editSupply function
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Material</th>
            <th className={styles.th}>Supplier</th>
            <th className={styles.th}>SKU</th>
            <th className={styles.th}>Qty</th>
            <th className={styles.th}>Unit</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Total</th>
            <th className={styles.th}>Status</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredSupplies.map((supply) => (
            <tr key={supply.id} className={styles.borderT}>
              <td className={styles.td}>{supply.material_name}</td>
              <td className={styles.td}>{getSupplierName(supply.supplier_id)}</td>
              <td className={styles.td}>{supply.sku || 'N/A'}</td>
              <td className={styles.td}>{supply.quantity}</td>
              <td className={styles.td}>{supply.unit_of_measure}</td>
              <td className={styles.td}>₱{Number(supply.price_per_unit).toFixed(2)}</td>
              <td className={styles.td}>₱{Number(supply.total_cost || 0).toFixed(2)}</td>
              <td className={styles.td}>{supply.status}</td>
              <td className={styles.td}>
                <button
                  onClick={() => handleEditClick(supply)}
                  className={`${styles2.smallButton} ${styles2.editButton}`}
                >
                  Edit
                </button>
                <button
                  className={`${styles2.smallButton} ${styles2.deleteButton}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (supply.id) {
                      deleteSupply(supply.id);
                    }
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SupplyTable;
