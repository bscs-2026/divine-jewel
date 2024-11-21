import React, { useState, useEffect } from 'react';
import { generateBatchID } from '@/lib/generatorHelper';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import styles from '@/components/styles/Modal.module.css';
import { formatDate } from '@/lib/dateTimeHelper';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface Supplier {
  id: number;
  supplier_name: string;
}

interface Supply {
  supplier_id: number;
  sku?: string;
  material_name: string;
  quantity: number;
  unit_of_measure: string;
  price_per_unit: number;
  note?: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  batch_id?: string;
}

interface SupplyFormProps {
  addSupply: (supplies: Supply[], status: 'Pending' | 'Delivered') => Promise<{ ok: boolean }>;
  suppliers: Supplier[];
  onClose: () => void;
}

const SupplyForm: React.FC<SupplyFormProps> = ({ addSupply, suppliers, onClose }) => {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [materials, setMaterials] = useState<Supply[]>([
    {
      supplier_id: 0,
      sku: '',
      material_name: '',
      quantity: 0,
      unit_of_measure: '',
      price_per_unit: 0,
      note: '',
      status: 'Delivered',
    },
  ]);

  const [batchID, setBatchID] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [supplierError, setSupplierError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{ [index: number]: { [field: string]: string } }>({});
  const [employeeName, setEmployeeName] = useState<string>('');

  useEffect(() => {
    const firstName = getCookieValue('first_name') || '';
    const lastName = getCookieValue('last_name') || '';
    const userName = `${firstName} ${lastName}`.trim();
    setEmployeeName(userName || 'N/A');
}, []);

  useEffect(() => {
    const newBatchID = generateBatchID();
    setBatchID(newBatchID);

    const updateTime = () => {
      const now = new Date();
      setCurrentTime(formatDate(now.toISOString(), 'Asia/Manila'));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const resetForm = () => {
    setSelectedSupplier(null);
    setMaterials([
      {
        supplier_id: 0,
        sku: '',
        material_name: '',
        quantity: 0,
        unit_of_measure: '',
        price_per_unit: 0,
        note: '',
        status: 'Delivered',
      },
    ]);
    setValidationErrors({});
    setSupplierError(null);
  };

  const handleAddAnotherMaterial = () => {
    setMaterials([
      ...materials,
      {
        supplier_id: selectedSupplier!,
        sku: '',
        material_name: '',
        quantity: 0,
        unit_of_measure: '',
        price_per_unit: 0,
        note: '',
        status: 'Delivered',
      },
    ]);
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    let formIsValid = true;
    let errors: { [index: number]: { [field: string]: string } } = {};

    if (!selectedSupplier) {
      setSupplierError('Please select a supplier');
      formIsValid = false;
    } else {
      setSupplierError(null);
    }

    materials.forEach((material, index) => {
      errors[index] = {};

      if (!material.material_name) {
        errors[index].material_name = 'Material name is required';
        formIsValid = false;
      }

      if (!material.sku) {
        errors[index].sku = 'SKU is required';
        formIsValid = false;
      }

      if (material.quantity <= 0) {
        errors[index].quantity = 'Should be greater than 0';
        formIsValid = false;
      }

      if (!material.unit_of_measure) {
        errors[index].unit_of_measure = 'Unit of measure is required';
        formIsValid = false;
      }

      if (material.price_per_unit <= 0) {
        errors[index].price_per_unit = 'Should be greater than 0';
        formIsValid = false;
      }
    });

    setValidationErrors(errors);

    if (!formIsValid) {
      return;
    }

    const materialsToSubmit = materials.map((material) => ({
      ...material,
      supplier_id: selectedSupplier!,
      batch_id: batchID,
      status: 'Delivered',
    }));

    try {
      const response = await addSupply(materialsToSubmit, 'Delivered');

      if (response.ok) {
        setShowSuccessModal(true);

        setTimeout(() => {
          setShowSuccessModal(false);
          resetForm();
          onClose();
        }, 3000);
      } else {
        setErrorMessage('Failed to add supplies. Please try again.');
        setShowErrorModal(true);
        setTimeout(() => setShowErrorModal(false), 2000);
      }
    } catch (error) {
      setErrorMessage('An error occurred while submitting the form. Please try again.');
      setShowErrorModal(true);
      setTimeout(() => setShowErrorModal(false), 2000);
    }
  };

  const handleInputChange = (index: number, field: keyof Supply, value: any) => {
    const updatedMaterials = [...materials];

    if (field === 'quantity' || field === 'price_per_unit') {
      if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
        updatedMaterials[index] = {
          ...updatedMaterials[index],
          [field]: value === '' ? '' : Number(value),
        };
      }
    } else {
      updatedMaterials[index] = {
        ...updatedMaterials[index],
        [field]: value,
      };
    }

    setMaterials(updatedMaterials);
    setValidationErrors({ ...validationErrors, [index]: { ...validationErrors[index], [field]: '' } });
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>Add Supplies</h2>
        <div className={styles.modalSubHeading}>
          <p><strong>Batch ID:</strong> {batchID}</p>
          <p><strong>Date & Time:</strong> {currentTime}</p>
          <p><strong>Employee:</strong> {employeeName}</p>
        </div>
        <br />

        <form onSubmit={handleFormSubmit} >
          <div className={styles.modalItem}>
            <label>Supplier</label>
            <select
              className={`${styles.modalSelect} ${supplierError ? styles.inputError : ''}`}
              value={selectedSupplier ?? ''}
              onChange={(e) => {
                const selectedValue = Number(e.target.value);
                setSelectedSupplier(selectedValue);
                if (selectedValue) {
                  setSupplierError(null); // Clear the error when a valid supplier is selected
                } else {
                  setSupplierError('Please select a supplier'); // Keep error for invalid selection
                }
              }}
              placeholder={supplierError || 'Select a supplier'}
            >
              <option value="">Select a Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>
                  {supplier.supplier_name}
                </option>
              ))}
            </select>
          </div>

          {materials.map((material, index) => (
            <div key={index} >
              <p><strong>Material {index + 1}</strong></p>

              <div className={styles.modalItem}>
                <label>Material Name</label>
                <input
                  className={`${styles.modalInputFixed} ${validationErrors[index]?.material_name ? styles.inputError : ''}`}
                  type="text"
                  value={material.material_name}
                  onChange={(e) => handleInputChange(index, 'material_name', e.target.value)}
                  placeholder={validationErrors[index]?.material_name || 'Enter material name'}
                />
              </div>

              <div className={styles.modalItem}>
                <label>SKU</label>
                <input
                  className={`${styles.modalInputFixed} ${validationErrors[index]?.sku ? styles.inputError : ''}`}
                  type="text"
                  value={material.sku}
                  onChange={(e) => handleInputChange(index, 'sku', e.target.value)}
                  placeholder={validationErrors[index]?.sku || 'Enter SKU'}
                />
              </div>

              <div className={styles.modalItem}>
                <label>Quantity</label>
                <input
                  className={`${styles.modalInputFixed} ${validationErrors[index]?.quantity ? styles.inputError : ''}`}
                  type="number"
                  value={material.quantity}
                  onChange={(e) => handleInputChange(index, 'quantity', parseInt(e.target.value))}
                  placeholder={validationErrors[index]?.quantity || 'Enter quantity'}
                />
              </div>

              <div className={styles.modalItem}>
                <label>Unit of Measure</label>
                <input
                  className={`${styles.modalInputFixed} ${validationErrors[index]?.unit_of_measure ? styles.inputError : ''}`}
                  type="text"
                  value={material.unit_of_measure}
                  onChange={(e) => handleInputChange(index, 'unit_of_measure', e.target.value)}
                  placeholder={validationErrors[index]?.unit_of_measure || 'Enter unit of measure'}
                />
              </div>

              <div className={styles.modalItem}>
                <label>Price per Unit</label>
                <input
                  className={`${styles.modalInputFixed} ${validationErrors[index]?.price_per_unit ? styles.inputError : ''}`}
                  type="number"
                  value={material.price_per_unit}
                  onChange={(e) => handleInputChange(index, 'price_per_unit', e.target.value)}
                  placeholder={validationErrors[index]?.price_per_unit || 'Enter price per unit'}
                />
              </div>

              <div className={styles.iconButtonContainer}>
                <RemoveCircleIcon
                  className={styles.iconButton}
                  onClick={() => setMaterials(materials.filter((_, i) => i !== index))}
                />
              </div>
            </div>
          ))}

          <div className={styles.iconButtonContainer}>
            <AddCircleIcon className={styles.iconButton} onClick={handleAddAnotherMaterial} />
          </div>

          <div className={styles.modalMediumButtonContainer}>
            <button type="submit" className={styles.modalMediumButton}>
              Submit as Delivered
            </button>
          </div>
        </form>

        {showErrorModal && (
          <div className={`${styles.successModal} show`}>
            <p>{errorMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyForm;
