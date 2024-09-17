import React, { useState, useEffect } from 'react';
import styles from '../styles/Modal.module.css';

interface Supplier {
  id: number;
  supplier_name: string;
  contact_info?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

interface Supply {
  id?: number;
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
  selectedSupplier: number | null;
  setSelectedSupplier: (id: number | null) => void;
  handleCancelEdit: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({
  currentSupply,
  addSupply,
  saveSupply,
  suppliers,
  selectedSupplier,
  setSelectedSupplier,
  handleCancelEdit,
}) => {
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
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  
    if (!materialName || !quantity || !unitOfMeasure || !pricePerUnit || selectedSupplier === null) {
      alert('Please fill out all required fields');
      return;
    }
  
    const supplyData: Supply = {
      id: currentSupply?.id || Date.now(), // Reuse existing ID if editing
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
      saveSupply(supplyData); // Call saveSupply when editing
    } else {
      addSupply(supplyData);
    }
  
    resetForm();
  };
  

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>
          {currentSupply ? 'Edit Supply' : 'Add Supply'}
        </h2>

        <form onSubmit={handleFormSubmit}>
          <select
            name="supplier_id"
            value={selectedSupplier ?? ''}
            onChange={(e) => setSelectedSupplier(Number(e.target.value))}
            className={styles.modalSelect}
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
            className={styles.modalInput}
          />
          <input
            type="text"
            name="material_name"
            placeholder="Material Name"
            value={materialName}
            onChange={(e) => setMaterialName(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="text"
            name="unit_of_measure"
            placeholder="Unit of Measure"
            value={unitOfMeasure}
            onChange={(e) => setUnitOfMeasure(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="number"
            name="price_per_unit"
            placeholder="Price per Unit"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            className={styles.modalInput}
          />
          <textarea
            name="note"
            placeholder="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className={styles.modalInput}
          />

          <select
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'pending' | 'delivered' | 'cancelled')}
            className={styles.modalSelect}
          >
            <option value="pending">Pending</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <div className={styles.modalMediumButtonContainer}>
            <button type="submit" className={`${styles.modalMediumButton}`}>
              {currentSupply ? 'Save Changes' : 'Add Supply'}
            </button>
            {currentSupply && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className={`${styles.modalMediumButton}`}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplyForm;
