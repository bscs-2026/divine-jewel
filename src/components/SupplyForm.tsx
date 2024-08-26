import React, { useState, useEffect } from 'react';
import styles from './styles/Layout.module.css';
import formStyles from './styles/Form.module.css';
import buttonStyles from './styles/Button.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWarehouse, faTruck, faFilePen, faSquareMinus } from '@fortawesome/free-solid-svg-icons';

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
  supplier_id: number;
  sku?: string;
  material_name: string;
  quantity: number;
  unit_of_measure: string;
  price_per_unit: number;
  note?: string;
  status: 'pending' | 'delivered' | 'cancelled';
}

interface SupplyFormProps {
  currentSupply: Supply | null;
  addSupply: (supply: Supply) => void;
  saveSupply: (supply: Supply) => void;
  suppliers: Supplier[];
  addSupplier: (supplier: Supplier) => void;
  editSupplier: (supplier: Supplier) => void;
  deleteSupplier: (id: number) => void;
  selectedSupplier: number | null;
  setSelectedSupplier: (id: number | null) => void;
  handleCancelEdit: () => void;
  switchToSuppliesTab: () => void;
  setActiveTab: (tab: 'supplies' | 'suppliers' | 'editSupplier' | 'deleteSupplier') => void;
  setCurrentSupply: (supply: Supply | null) => void;
  activeTab: 'supplies' | 'suppliers' | 'editSupplier' | 'deleteSupplier';
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  currentSupply,
  addSupply,
  saveSupply,
  suppliers,
  addSupplier,
  editSupplier,
  deleteSupplier,
  selectedSupplier,
  setSelectedSupplier,
  handleCancelEdit,
  switchToSuppliesTab,
  setActiveTab,
  setCurrentSupply,
  activeTab,
}) => {
  const [editingSupplier, setEditingSupplier] = useState<boolean>(false);
  const [supplierFormData, setSupplierFormData] = useState<Supplier>({
    id: 0,
    supplier_name: '',
    contact_info: '',
    address: '',
    email: '',
    phone_number: '',
  });

  const [sku, setSku] = useState<string>('');
  const [materialName, setMaterialName] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [unitOfMeasure, setUnitOfMeasure] = useState<string>('');
  const [pricePerUnit, setPricePerUnit] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'delivered' | 'cancelled'>('pending');

  useEffect(() => {
    if (currentSupply) {
      setSku(currentSupply.sku || '');
      setMaterialName(currentSupply.material_name);
      setQuantity(currentSupply.quantity.toString());
      setUnitOfMeasure(currentSupply.unit_of_measure);
      setPricePerUnit(currentSupply.price_per_unit.toString());
      setNote(currentSupply.note || '');
      setStatus(currentSupply.status);
      setSelectedSupplier(currentSupply.supplier_id);
    } else {
      resetForm();
    }
  }, [currentSupply]);

  const resetForm = () => {
    setSku('');
    setMaterialName('');
    setQuantity('');
    setUnitOfMeasure('');
    setPricePerUnit('');
    setNote('');
    setStatus('pending');
    setSelectedSupplier(null);
    setSupplierFormData({
      id: 0,
      supplier_name: '',
      contact_info: '',
      address: '',
      email: '',
      phone_number: '',
    });
    setEditingSupplier(false);
  };

  const handleSupplyFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!materialName || !quantity || !unitOfMeasure || !pricePerUnit || selectedSupplier === null) {
      alert('Please fill out all required fields');
      return;
    }

    const supplyData: Supply = {
      id: currentSupply?.id || Date.now(),
      supplier_id: selectedSupplier,
      sku,
      material_name: materialName,
      quantity: parseInt(quantity, 10),
      unit_of_measure: unitOfMeasure,
      price_per_unit: parseFloat(pricePerUnit),
      note,
      status,
    };

    if (currentSupply) {
      saveSupply(supplyData);
    } else {
      addSupply(supplyData);
    }

    resetForm();
  };

  const handleSupplierSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!supplierFormData.supplier_name) {
      alert('Please fill out all required fields');
      return;
    }

    if (editingSupplier) {
      editSupplier(supplierFormData);
    } else {
      addSupplier({
        ...supplierFormData,
        id: Date.now(),
      });
    }

    resetForm();
  };

  const handleEditSupplier = (id: number) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    if (supplier) {
      setSupplierFormData(supplier);
      setEditingSupplier(true);
    }
  };

  const selectSupplierForDeletion = (id: number) => {
    const supplier = suppliers.find((supplier) => supplier.id === id);
    if (supplier) {
      setSupplierFormData(supplier);
    }
  };

  const confirmAndDeleteSupplier = async () => {
    if (supplierFormData.id) {
      const confirmed = window.confirm(`Are you sure you want to delete the supplier: ${supplierFormData.supplier_name}?`);
      if (confirmed) {
        await deleteSupplier(supplierFormData.id);
        resetForm();
      }
    } else {
      alert('Please select a supplier to delete.');
    }
  };

  const handleTabSwitch = (tab: 'supplies' | 'suppliers' | 'editSupplier' | 'deleteSupplier') => {
    setActiveTab(tab);
    resetForm();
    if (tab === 'supplies') {
      setCurrentSupply(null);
    }
  };

  return (
    <div className={formStyles.container}>
      <div className={formStyles.tabContainer}>
        <button
          className={`${styles.iconItem} ${activeTab === 'supplies' ? styles.active : styles.inactive}`}
          onClick={() => handleTabSwitch('supplies')}
        >
          <FontAwesomeIcon icon={faWarehouse} />
        </button>
        <button
          className={`${styles.iconItem} ${activeTab === 'suppliers' ? styles.active : styles.inactive}`}
          onClick={() => handleTabSwitch('suppliers')}
        >
          <FontAwesomeIcon icon={faTruck} />
        </button>
        <button
          className={`${styles.iconItem} ${activeTab === 'editSupplier' ? styles.active : styles.inactive}`}
          onClick={() => handleTabSwitch('editSupplier')}
        >
          <FontAwesomeIcon icon={faFilePen} />
        </button>
        <button
          className={`${styles.iconItem} ${activeTab === 'deleteSupplier' ? styles.active : styles.inactive}`}
          onClick={() => handleTabSwitch('deleteSupplier')}
        >
          <FontAwesomeIcon icon={faSquareMinus} />
        </button>
      </div>

      {activeTab === 'supplies' && (
        <div>
          <p className={formStyles.heading}>{currentSupply ? 'Edit Supply' : 'Add Supply'}</p>
          <form onSubmit={handleSupplyFormSubmit} className={formStyles.form}>
            <select
              name="supplier_id"
              value={selectedSupplier ?? ''}
              onChange={(e) => setSelectedSupplier(Number(e.target.value))}
              className={formStyles.select}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="sku"
              placeholder="SKU"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              className={formStyles.input}
            />
            <input
              type="text"
              name="material_name"
              placeholder="Material Name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              className={formStyles.input}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className={formStyles.input}
            />
            <input
              type="text"
              name="unit_of_measure"
              placeholder="Unit of Measure"
              value={unitOfMeasure}
              onChange={(e) => setUnitOfMeasure(e.target.value)}
              className={formStyles.input}
            />
            <input
              type="number"
              name="price_per_unit"
              placeholder="Price per Unit"
              value={pricePerUnit}
              onChange={(e) => setPricePerUnit(e.target.value)}
              className={formStyles.input}
            />
            <textarea
              name="note"
              placeholder="Note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={formStyles.input}
            />
            <select
              name="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as 'pending' | 'delivered' | 'cancelled')}
              className={formStyles.select}
            >
              <option value="pending">Pending</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit" className={`${buttonStyles.smallButton} ${buttonStyles.addButton}`}>
              {currentSupply ? 'Save Changes' : 'Add Supply'}
            </button>
            {currentSupply && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${buttonStyles.smallButton} ${buttonStyles.cancelButton}`}
              >
                Cancel
              </button>
            )}
          </form>
        </div>
      )}

      {activeTab === 'suppliers' && (
        <div>
          <p className={formStyles.heading}>Add Supplier</p>
          <form onSubmit={handleSupplierSubmit} className={formStyles.form}>
            <input
              type="text"
              name="supplier_name"
              placeholder="Supplier Name"
              value={supplierFormData.supplier_name}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  supplier_name: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              value={supplierFormData.contact_info}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  contact_info: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={supplierFormData.address}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  address: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={supplierFormData.email}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  email: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={supplierFormData.phone_number}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  phone_number: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <button type="submit" className={`${buttonStyles.smallButton} ${buttonStyles.addButton}`}>
              Save
            </button>
            <button
              type="button"
              onClick={resetForm}
              className={`${buttonStyles.smallButton} ${buttonStyles.cancelButton}`}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {activeTab === 'editSupplier' && (
        <div>
          <p className={formStyles.heading}>Edit Supplier</p>
          <form onSubmit={handleSupplierSubmit} className={formStyles.form}>
            <select
              value={supplierFormData.id || ''}
              onChange={(e) => handleEditSupplier(Number(e.target.value))}
              className={formStyles.select}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="supplier_name"
              placeholder="Supplier Name"
              value={supplierFormData.supplier_name}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  supplier_name: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="contact_info"
              placeholder="Contact Info"
              value={supplierFormData.contact_info}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  contact_info: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={supplierFormData.address}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  address: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={supplierFormData.email}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  email: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <input
              type="text"
              name="phone_number"
              placeholder="Phone Number"
              value={supplierFormData.phone_number}
              onChange={(e) =>
                setSupplierFormData({
                  ...supplierFormData,
                  phone_number: e.target.value,
                })
              }
              className={formStyles.input}
            />
            <button type="submit" className={`${buttonStyles.smallButton} ${buttonStyles.addButton}`}>
              Save
            </button>
            <button
              type="button"
              onClick={resetForm}
              className={`${buttonStyles.smallButton} ${buttonStyles.cancelButton}`}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {activeTab === 'deleteSupplier' && (
        <div>
          <p className={formStyles.heading}>Delete Supplier</p>
          <form className={formStyles.form}>
            <select
              value={supplierFormData.id || ''}
              onChange={(e) => selectSupplierForDeletion(Number(e.target.value))}
              className={formStyles.select}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={confirmAndDeleteSupplier}
              className={`${buttonStyles.smallButton} ${buttonStyles.deleteButton}`}
            >
              Delete
            </button>
            <button
              type="button"
              onClick={resetForm}
              className={`${buttonStyles.smallButton} ${buttonStyles.cancelButton}`}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupplyForm;
