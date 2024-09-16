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

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!productName || !productPrice || !productSKU || !productSize || !productColor || selectedCategory === null) {
      alert('Please fill out all fields');
      return;
    }

    const updatedProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now(),
      SKU: productSKU,
      category_id: selectedCategory,
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

    onClose();  // Close the modal after saving
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </h2>

        <form onSubmit={handleFormSubmit}>
          <input
            type="text"
            name="SKU"
            placeholder="SKU"
            value={productSKU}
            onChange={(e) => setProductSKU(e.target.value)}
            className={styles.modalInput}
          />
          <select
            name="category_id"
            value={selectedCategory ?? ''}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className={styles.modalSelect}
          >
            <option value="">Product Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="text"
            name="size"
            placeholder="Size"
            value={productSize}
            onChange={(e) => setProductSize(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="text"
            name="color"
            placeholder="Color"
            value={productColor}
            onChange={(e) => setProductColor(e.target.value)}
            className={styles.modalInput}
          />
          <input
            type="text"
            name="price"
            placeholder="Price"
            value={productPrice}
            onChange={(e) => setProductPrice(e.target.value)}
            className={styles.modalInput}
          />

          <div className={styles.modalMediumButtonContainer}>
            <button type="submit" className={`${styles.modalMediumButton}`}>
              {editingProduct ? 'Save Product' : 'Add Product'}
            </button>
            {editingProduct && (
              <button
                type="button"
                onClick={onClose}
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

export default ProductForm;
