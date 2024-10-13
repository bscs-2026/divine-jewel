import React, { useState, useEffect } from 'react';
import styles2 from '../styles/Button.module.css';
import styles from '../styles/Modal.module.css';

interface Category {
  id: number;
  name: string;
  description: string;
}

interface Product {
  id: number;
  SKU: string;
  category_id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
}

interface ProductFormProps {
  categories: Category[];
  currentProduct: Product | null;
  selectedCategory: number | null;
  setSelectedCategory: (id: number | null) => void;
  editingProduct: boolean;
  handleCancelEdit: () => void;
  addProduct: (product: Product) => void;
  saveProduct: (product: Product) => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  categories,
  currentProduct,
  selectedCategory,
  setSelectedCategory,
  editingProduct,
  handleCancelEdit,
  addProduct,
  saveProduct,
  onClose
}) => {
  const [productSKU, setProductSKU] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productSize, setProductSize] = useState<string>('');
  const [productColor, setProductColor] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [field: string]: string }>({});

  useEffect(() => {
    if (editingProduct && currentProduct) {
      setProductSKU(currentProduct.SKU);
      setProductName(currentProduct.name);
      setProductSize(currentProduct.size);
      setProductColor(currentProduct.color);
      setProductPrice(currentProduct.price.toString());
      setSelectedCategory(currentProduct.category_id);
    } else {
      setProductSKU('');
      setProductName('');
      setProductSize('');
      setProductColor('');
      setProductPrice('');
      setSelectedCategory(null);
    }
  }, [currentProduct, editingProduct, setSelectedCategory]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "SKU") {
      setProductSKU(value);
      setValidationErrors(prev => ({ ...prev, SKU: '' }));
    }

    if (name === "category_id") {
      setSelectedCategory(value ? Number(value) : null);
      setValidationErrors(prev => ({ ...prev, category: '' }));
    }

    if (name === "name") {
      setProductName(value);
      setValidationErrors(prev => ({ ...prev, name: '' }));
    }

    if (name === "size") {
      setProductSize(value);
      setValidationErrors(prev => ({ ...prev, size: '' }));
    }

    if (name === "color") {
      setProductColor(value);
      setValidationErrors(prev => ({ ...prev, color: '' }));
    }

    if (name === "price") {
      if (value === '' || (Number(value) >= 0 && !isNaN(Number(value)))) {
        setProductPrice(value);
      }
      setValidationErrors(prev => ({ ...prev, price: '' }));
    }
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let formIsValid = true;
    let errors: { [field: string]: string } = {};

    // Validate SKU length (between 1 and 15 characters)
    if (!productSKU) {
      errors.SKU = "SKU is required";
      formIsValid = false;
    } else if (productSKU.length < 1 || productSKU.length > 15) {
      errors.SKU = "Must be between 1 and 15 characters.";
      formIsValid = false;
    }

    // Validate category
    if (selectedCategory === null) {
      errors.category = "Category is required";
      formIsValid = false;
    }

    // Validate name
    if (!productName) {
      errors.name = "Product name is required";
      formIsValid = false;
    }

    // Validate size
    if (!productSize) {
      errors.size = "Size is required";
      formIsValid = false;
    }

    // Validate color
    if (!productColor) {
      errors.color = "Color is required";
      formIsValid = false;
    }

    // Validate price
    if (productPrice === '') {
      errors.price = "Price is required";
      formIsValid = false;
    } else if (parseFloat(productPrice) < 0) {
      errors.price = "Must be a positive number";
      formIsValid = false;
    }

    setValidationErrors(errors);

    if (!formIsValid) {
      return;
    }

    const updatedProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now(),
      SKU: productSKU,
      category_id: selectedCategory || 0,
      name: productName,
      price: parseFloat(productPrice),
      quantity: currentProduct ? currentProduct.quantity : 1,
      size: productSize,
      color: productColor,
    };

    if (editingProduct) {
      saveProduct(updatedProduct);
    } else {
      addProduct(updatedProduct);
    }

    // Clear form after saving
    setProductSKU('');
    setProductName('');
    setProductSize('');
    setProductColor('');
    setProductPrice('');
    setSelectedCategory(null);
    setValidationErrors({});
    onClose();
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </h2>

        <form onSubmit={handleFormSubmit}>
          <label className={styles.modalInputLabel}>
            SKU
          </label>
          <input
            type="text"
            name="SKU"
            placeholder={validationErrors.SKU || "SKU"}
            value={productSKU}
            onChange={handleInputChange}
            maxLength={15}
            className={`${styles.modalInput} ${validationErrors.SKU ? styles.inputError : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Category
          </label>
          <select
            name="category_id"
            value={selectedCategory ?? ''}
            onChange={handleInputChange}
            className={`${styles.modalSelect} ${validationErrors.category ? styles.inputError : ''}`}
          >
            <option value="">{validationErrors.category || "Product Category"}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <label className={styles.modalInputLabel}>
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder={validationErrors.name || "Product Name"}
            value={productName}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.name ? styles.inputError : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Size
          </label>
          <input
            type="text"
            name="size"
            placeholder={validationErrors.size || "Size"}
            value={productSize}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.size ? styles.inputError : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Color
          </label>
          <input
            type="text"
            name="color"
            placeholder={validationErrors.color || "Color"}
            value={productColor}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.color ? styles.inputError : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder={validationErrors.price || "Price"}
            value={productPrice}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.price ? styles.inputError : ''}`}
            min="0"
          />

          <div className={styles.modalMediumButtonContainer}>
            <button type="submit" className={styles.modalMediumButton}>
              {editingProduct ? 'Save Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={onClose}
                className={styles.modalMediumButton}
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

export default ProductForm;
