// src/components/ManageSuppliers.tsx

import React, { useState } from 'react';
import styles from './styles/Form.module.css';
import styles2 from './styles/Button.module.css';

interface Supplier {
  id?: number;
  supplier_name: string;
  contact_info?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

interface ManageSuppliersProps {
  suppliers: Supplier[];
  onSupplierAdded: () => void;
  addSupplier: (supplier: Supplier) => void;
  editSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: number) => void;
}

const ManageSuppliers: React.FC<ManageSuppliersProps> = ({
  suppliers,
  onSupplierAdded,
  addSupplier,
  editSupplier,
  deleteSupplier,
}) => {
  const initialFormData: Supplier = {
    supplier_name: '',
    contact_info: '',
    address: '',
    email: '',
    phone_number: '',
  };

  const [formData, setFormData] = useState<Supplier>(initialFormData);
  const [action, setAction] = useState<'add' | 'edit' | 'delete' | null>(null);

  const handleAddSupplier = () => {
    addSupplier(formData);
    resetForm();
    onSupplierAdded();
  };

  const handleEditSupplier = () => {
    if (formData.id) {
      editSupplier(formData);
      resetForm();
      onSupplierAdded();
    }
  };

  const handleDeleteSupplier = () => {
    if (formData.id) {
      deleteSupplier(formData.id);
      resetForm();
      onSupplierAdded();
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setAction(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Manage Suppliers</h2>
      {!action && (
        <form className={styles.form}>
          <button
            className={`${styles2.smallButton} ${styles2.addButton}`}
            onClick={() => setAction('add')}
          >
            Add Supplier
          </button>
          <button
            className={`${styles2.smallButton} ${styles2.editButton}`}
            onClick={() => setAction('edit')}
          >
            Edit Supplier
          </button>
          <button
            className={`${styles2.smallButton} ${styles2.deleteButton}`}
            onClick={() => setAction('delete')}
          >
            Delete Supplier
          </button>
        </form>
      )}

      {action === 'add' && (
        <form className={styles.form}>
          <h3>Add Supplier</h3>
          <input
            type="text"
            placeholder="Supplier Name"
            value={formData.supplier_name}
            onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={formData.contact_info}
            onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className={styles.input}
          />
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.addButton}`}
            onClick={handleAddSupplier}
          >
            Add
          </button>
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.cancelButton}`}
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}

      {action === 'edit' && (
        <form className={styles.form}>
          <h3>Edit Supplier</h3>
          <select
            onChange={(e) => {
              const selectedSupplier = suppliers.find(supplier => supplier.id === Number(e.target.value));
              if (selectedSupplier) {
                setFormData(selectedSupplier);
              }
            }}
            className={styles.select}
            value={formData.id || ''}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Supplier Name"
            value={formData.supplier_name}
            onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Contact Info"
            value={formData.contact_info}
            onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className={styles.input}
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className={styles.input}
          />
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.editButton}`}
            onClick={handleEditSupplier}
          >
            Save Changes
          </button>
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.cancelButton}`}
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}

      {action === 'delete' && (
        <form className={styles.form}>
          <h3>Delete Supplier</h3>
          <select
            onChange={(e) => setFormData({ ...formData, id: Number(e.target.value) })}
            className={styles.select}
            value={formData.id || ''}
          >
            <option value="">Select Supplier</option>
            {suppliers.map(supplier => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.supplier_name}
              </option>
            ))}
          </select>
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.deleteButton}`}
            onClick={handleDeleteSupplier}
          >
            Delete
          </button>
          <button
            type="button"
            className={`${styles2.smallButton} ${styles2.cancelButton}`}
            onClick={resetForm}
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default ManageSuppliers;
