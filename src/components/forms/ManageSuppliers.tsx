import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
import DeleteConfirmationModal from '../modals/DeleteConfirmationModal';
import styles from '../styles/Modal.module.css';

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
  addSupplier: (supplier: Supplier) => void;
  editSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: number) => void;
}

const ManageSuppliers: React.FC<ManageSuppliersProps> = ({
  suppliers,
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
  const [editingSupplierId, setEditingSupplierId] = useState<number | null>(null);
  const [action, setAction] = useState<'add' | 'edit' | null>(null);

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.supplier_name.trim() === '') return;
    addSupplier(formData);
    setFormData(initialFormData);
    setAction(null);
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setFormData(supplier);
    setEditingSupplierId(supplier.id || null);
    setAction('edit');
  };

  const handleSaveEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.supplier_name.trim() === '') return;
    editSupplier(formData);
    setFormData(initialFormData);
    setEditingSupplierId(null);
    setAction(null);
  };

  const handleDeleteSupplier = (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirmDelete) return;
    deleteSupplier(id);
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingSupplierId(null);
    setAction(null);
  };

  return (
    <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Manage Suppliers</h2>

        {action && (
          <form className={styles.modalForm} onSubmit={action === 'add' ? handleAddSupplier : handleSaveEditSupplier}>
            <input
              type="text"
              placeholder="Supplier Name"
              value={formData.supplier_name}
              onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
              className={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Contact Info"
              value={formData.contact_info}
              onChange={(e) => setFormData({ ...formData, contact_info: e.target.value })}
              className={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={styles.modalInput}
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={styles.modalInput}
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              className={styles.modalInput}
            />
            <div className={styles.modalMediumButtonContainer}>
              <button
                type="button"
                className={styles.modalMediumButton}
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button type="submit" className={styles.modalMediumButton}>
                {action === 'add' ? 'Add' : 'Save'}
              </button>
            </div>
          </form>
        )}

        <table className={styles.modalTable}>
          <thead>
            <tr>
              <th>Supplier Name</th>
              <th>Contact Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id}>
                <td>{supplier.supplier_name}</td>
                <td>{supplier.phone_number}</td>
                <td>
                  <Edit
                    onClick={() => handleEditSupplier(supplier)}
                    className={styles.modalEditButton}
                  />
    
                  <Delete
                    onClick={() => handleDeleteSupplier(supplier.id!)}
                    className={styles.modalDeleteIcon}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.modalMediumButtonContainer}>
          <button
            className={styles.modalMediumButton}
            onClick={() => {
              setFormData(initialFormData);
              setEditingSupplierId(null);
              setAction('add');
            }}
          >
            Add Supplier
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSuppliers;
