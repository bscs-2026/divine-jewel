import React, { useState, useEffect } from 'react';
import styles from './styles/Form.module.css';
import styles2 from './styles/Button.module.css';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
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
}) => {
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');

  useEffect(() => {
    if (editingProduct && currentProduct) {
      setProductName(currentProduct.name);
      setProductPrice(currentProduct.price.toString());
      setSelectedCategory(currentProduct.category_id);
    } else {
      setProductName('');
      setProductPrice('');
      setSelectedCategory(null);
    }
  }, [currentProduct, editingProduct, setSelectedCategory]);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductPrice(e.target.value);
  };

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!productName || !productPrice || selectedCategory === null) {
      alert('Please fill out all fields');
      return;
    }

    const updatedProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now(),
      category_id: selectedCategory,
      name: productName,
      price: parseFloat(productPrice),
      quantity: currentProduct ? currentProduct.quantity : 1,
    };

    if (editingProduct) {
      saveProduct(updatedProduct);
    } else {
      addProduct(updatedProduct);
    }

    // Clear form after saving
    setProductName('');
    setProductPrice('');
    setSelectedCategory(null);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>
        {editingProduct ? 'Edit Product' : 'Add Product'}
      </h2>
      <form onSubmit={handleFormSubmit} className={styles.form}>
        <select
          name="category_id"
          value={selectedCategory ?? ''}
          onChange={(e) => setSelectedCategory(Number(e.target.value))}
          className={styles.select}
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
          className={styles.input}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={productPrice}
          onChange={handlePriceChange}
          className={styles.input}
        />
        <button type="submit" className={`${styles2.smallButton} ${styles2.addButton}`}>
          {editingProduct ? 'Save' : 'Add'}
        </button>
        {editingProduct && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className={`${styles2.smallButton} ${styles2.cancelButton}`}
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
