import React, { useState } from 'react';
import { Edit, Delete } from '@mui/icons-material';
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
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [supplierToDelete, setSupplierToDelete] = useState<{ id: number | null; name: string | null }>({
    id: null,
    name: null,
  });

  // Check for duplicate supplier name
  const isDuplicateSupplierName = (name: string): boolean => {
    return suppliers.some(
      (supplier) =>
        supplier.supplier_name.toLowerCase() === name.toLowerCase() &&
        supplier.id !== editingSupplierId
    );
  };

  const validateForm = (): boolean => {
    let formIsValid = true;
    const newErrors: { [key: string]: string } = {};

    if (!formData.supplier_name.trim()) {
      newErrors.supplier_name = 'Supplier name is required';
      formIsValid = false;
    } else if (isDuplicateSupplierName(formData.supplier_name)) {
      // Show error modal and clear input field if duplicate
      const duplicateName = formData.supplier_name;
      newErrors.supplier_name = `'${duplicateName}' already exists`;
      setFormData({ ...formData, supplier_name: '' }); // Clear the supplier name input field like in ManageCategories
      formIsValid = false;
    }

    if (!formData.contact_info?.trim()) {
      newErrors.contact_info = 'Contact Person Name is required';
      formIsValid = false;
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Address is required';
      formIsValid = false;
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
      formIsValid = false;
    }

    if (!formData.phone_number || !/^\d+$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Valid phone number is required';
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      addSupplier(formData);
      setFormData(initialFormData);
      setAction(null);
      setErrors({});
    }
  };

  const handleEditSupplier = (supplier: Supplier) => {
    setFormData(supplier);
    setEditingSupplierId(supplier.id || null);
    setAction('edit');
  };

  const handleSaveEditSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      editSupplier(formData);
      setFormData(initialFormData);
      setEditingSupplierId(null);
      setAction(null);
      setErrors({});
    }
  };

  const handleDeleteSupplier = (id: number, name: string) => {
    setSupplierToDelete({ id, name });
    setShowDeleteModal(true);
  };

  const confirmDeleteSupplier = () => {
    if (supplierToDelete.id !== null) {
      deleteSupplier(supplierToDelete.id);
      setShowDeleteModal(false);
      setSupplierToDelete({ id: null, name: null });
    }
  };

  const cancelDeleteSupplier = () => {
    setShowDeleteModal(false);
    setSupplierToDelete({ id: null, name: null });
  };

  const handleCancelEdit = () => {
    setFormData(initialFormData);
    setEditingSupplierId(null);
    setAction(null);
    setErrors({});
  };

  return (
    <div className={`${styles.modalContent} ${styles.modalContentBig}`}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Manage Suppliers</h2>

        {action && (
          <form className={styles.modalForm} onSubmit={action === 'add' ? handleAddSupplier : handleSaveEditSupplier}>
            <input
              type="text"
              placeholder={errors.supplier_name || 'Supplier Name'}
              value={formData.supplier_name}
              onChange={(e) => {
                setFormData({ ...formData, supplier_name: e.target.value });
                setErrors({ ...errors, supplier_name: '' });
              }}
              className={`${styles.modalInput} ${errors.supplier_name ? styles.inputError : ''}`}
            />

            <input
              type="text"
              placeholder={errors.contact_info || 'Contact Person Name'}
              value={formData.contact_info}
              onChange={(e) => {
                setFormData({ ...formData, contact_info: e.target.value });
                setErrors({ ...errors, contact_info: '' });
              }}
              className={`${styles.modalInput} ${errors.contact_info ? styles.inputError : ''}`}
            />

            <input
              type="text"
              placeholder={errors.address || 'Address'}
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value });
                setErrors({ ...errors, address: '' });
              }}
              className={`${styles.modalInput} ${errors.address ? styles.inputError : ''}`}
            />

            <input
              type="email"
              placeholder={errors.email || 'Email'}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                setErrors({ ...errors, email: '' });
              }}
              className={`${styles.modalInput} ${errors.email ? styles.inputError : ''}`}
            />

            <input
              type="text"
              placeholder={errors.phone_number || 'Phone Number'}
              value={formData.phone_number}
              onChange={(e) => {
                setFormData({ ...formData, phone_number: e.target.value });
                setErrors({ ...errors, phone_number: '' });
              }}
              className={`${styles.modalInput} ${errors.phone_number ? styles.inputError : ''}`}
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
                    onClick={() => handleDeleteSupplier(supplier.id!, supplier.supplier_name)}
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

      {showErrorModal && (
        <div className={styles.errorModal}>
          <p>{errorMessage}</p>
        </div>
      )}

      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <p>Are you sure you want to remove {supplierToDelete.name} as your supplier?</p>
          <div className={styles.modalMediumButtonContainer}>
            <button onClick={confirmDeleteSupplier} className={styles.modalMediumButton}>
              Confirm
            </button>
            <button onClick={cancelDeleteSupplier} className={styles.modalMediumButton}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSuppliers;
