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
  const [errors, setErrors] = useState<{ [key: string]: string }>({}); // Track errors for each input

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
      setSelectedCategory(null); // Set category to null for new products
    }
  }, [currentProduct, editingProduct, setSelectedCategory]);

  // Validate SKU length (between 1 and 15 characters)
  const validateSKU = (sku: string) => {
    if (sku.length < 1 || sku.length > 15) {
      setErrors((prev) => ({ ...prev, SKU: "SKU must be between 1 and 15 characters." }));
    } else {
      setErrors((prev) => {
        const { SKU, ...rest } = prev;
        return rest; // Remove the SKU error if validation passes
      });
    }
  };

  // Validate Price (must be a positive number)
  const validatePrice = (price: string) => {
    if (price === '' || parseFloat(price) < 0) {
      setErrors((prev) => ({ ...prev, price: "Price cannot be empty or a negative value." }));
    } else {
      setErrors((prev) => {
        const { price, ...rest } = prev;
        return rest; // Remove the price error if validation passes
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "SKU") {
      setProductSKU(value);
      validateSKU(value);
    }

    if (name === "category_id") {
      setSelectedCategory(value ? Number(value) : null);
      if (!value) setErrors((prev) => ({ ...prev, category: "This field is required." }));
      else setErrors((prev) => {
        const { category, ...rest } = prev;
        return rest;
      });
    }

    if (name === "name") {
      setProductName(value);
      if (!value) setErrors((prev) => ({ ...prev, name: "This field is required." }));
      else setErrors((prev) => {
        const { name, ...rest } = prev;
        return rest;
      });
    }

    if (name === "size") {
      setProductSize(value);
      if (!value) setErrors((prev) => ({ ...prev, size: "This field is required." }));
      else setErrors((prev) => {
        const { size, ...rest } = prev;
        return rest;
      });
    }
    if (name === "color") {
      setProductColor(value);
      if (!value) setErrors((prev) => ({ ...prev, color: "This field is required." }));
      else setErrors((prev) => {
        const { color, ...rest } = prev;
        return rest;
      });
    }

    if (name === "price") {
      setProductPrice(value);
      validatePrice(value);
    }

  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure all fields are filled and valid
    if (!productSKU) validateSKU(productSKU);
    if (selectedCategory === null) setErrors((prev) => ({ ...prev, category: "This field is required." }));
    if (!productName) setErrors((prev) => ({ ...prev, name: "This field is required." }));
    if (!productSize) setErrors((prev) => ({ ...prev, size: "This field is required." }));
    if (!productColor) setErrors((prev) => ({ ...prev, color: "This field is required." }));
    if (!productPrice) validatePrice(productPrice);

    // Prevent submission if there are any validation errors
    if (Object.keys(errors).length > 0 || !productSKU || !productName || !productSize || !productColor || !productPrice || selectedCategory === null) {
      alert('Please fill out all the required fields before submitting.');
      return;
    }

    const updatedProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now(),
      SKU: productSKU,
      category_id: selectedCategory || 0, // Handle null category
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
    setErrors({}); // Clear any existing error messages
    onClose();  // Close the modal after saving
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
            placeholder="SKU"
            value={productSKU}
            onChange={handleInputChange}
            className={styles.modalInput}
          />
          {errors.SKU && <p className={styles.modalErrorText}>{errors.SKU}</p>}

          <label className={styles.modalInputLabel}>
            Category
          </label>
          <select
            name="category_id"
            value={selectedCategory ?? ''}
            onChange={handleInputChange}
            className={styles.modalSelect}
          >
            <option value="">Product Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <p className={styles.modalErrorText}>{errors.category}</p>}

          <label className={styles.modalInputLabel}>
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productName}
            onChange={handleInputChange}
            className={styles.modalInput}
          />
          {errors.name && <p className={styles.modalErrorText}>{errors.name}</p>}

          <label className={styles.modalInputLabel}>
            Size
          </label>
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={productSize}
            onChange={handleInputChange}
            className={styles.modalInput}
          />
          {errors.size && <p className={styles.modalErrorText}>{errors.size}</p>}
          <label className={styles.modalInputLabel}>
            Color
          </label>
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={productColor}
            onChange={handleInputChange}
            className={styles.modalInput}
          />
          {errors.color && <p className={styles.modalErrorText}>{errors.color}</p>}
          <label className={styles.modalInputLabel}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={productPrice}
            onChange={handleInputChange}
            className={styles.modalInput}
            min="0"
          />
          {errors.price && <p className={styles.modalErrorText}>{errors.price}</p>}

          <div className={styles.modalMediumButtonContainer}>
            <button type="submit" className={styles.modalMediumButton} disabled={Object.keys(errors).length > 0}>
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
