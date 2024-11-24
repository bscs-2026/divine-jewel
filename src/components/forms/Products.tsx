// src/components/forms/ProductForm.tsx

import React, { useState, useEffect } from 'react';
import styles from '@/components/styles/Modal.module.css';
import { Product, Category } from '@/types';

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
  loading: boolean;
  products: Product[];
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
  onClose,
  loading,
  products,
}) => {
  const [productSKU, setProductSKU] = useState<string>('');
  const [productName, setProductName] = useState<string>('');
  const [productSize, setProductSize] = useState<string>('');
  const [productColor, setProductColor] = useState<string>('');
  const [productPrice, setProductPrice] = useState<string>('');
  const [validationErrors, setValidationErrors] = useState<{ [field: string]: string }>({});
  const [originalCategory, setOriginalCategory] = useState<number | null>(null);
  const [originalSKU, setOriginalSKU] = useState<string>('');
  const [categorySelected, setCategorySelected] = useState<boolean>(false);
  const [productImage, setProductImage] = useState<File | null>(null);
  const [productImagePreview, setProductImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct && currentProduct) {
      setProductSKU(currentProduct.SKU || '');
      setProductName(currentProduct.name);
      setProductSize(currentProduct.size);
      setProductColor(currentProduct.color);
      setProductPrice(currentProduct.price.toString());
      setSelectedCategory(currentProduct.category_id);
      setOriginalCategory(currentProduct.category_id);
      setOriginalSKU(currentProduct.SKU || '');
      setCategorySelected(false);
    } else {
      setProductSKU('');
      setProductName('');
      setProductSize('');
      setProductColor('');
      setProductPrice('');
      setSelectedCategory(null);
      setOriginalCategory(null);
      setOriginalSKU('');
      setCategorySelected(false);
    }
  }, [currentProduct, editingProduct, setSelectedCategory]);

  const fetchLastSKU = async (categoryId: number) => {
    try {
      const response = await fetch(`/api/products/category/last-sku?categoryId=${categoryId}`);
      const data = await response.json();
      return data.lastSKU;
    } catch (error) {
      console.error("Error fetching last SKU:", error);
      return null;
    }
  };

  const generateSKU = async (categoryId: number, categoryName: string) => {
    const lastSKU = await fetchLastSKU(categoryId);
    const lastSkuNumber = lastSKU ? parseInt(lastSKU.split('-')[1]) : 0;
    const newSkuNumber = (lastSkuNumber + 1).toString().padStart(5, '0');
    const prefix = categoryName.slice(0, 3).toUpperCase();
    return `${prefix}-${newSkuNumber}`;
  };

  useEffect(() => {
    const updateSKU = async () => {
      if (categorySelected && selectedCategory !== null) {
        const selectedCategoryDetails = categories.find(cat => cat.id === selectedCategory);
        if (!selectedCategoryDetails) return;

        if (!editingProduct) {
          const newSKU = await generateSKU(selectedCategoryDetails.id, selectedCategoryDetails.name);
          setProductSKU(newSKU);
        } else if (editingProduct && selectedCategory === originalCategory) {
          setProductSKU(originalSKU);
        } else {
          const newSKU = await generateSKU(selectedCategoryDetails.id, selectedCategoryDetails.name);
          setProductSKU(newSKU);
        }
      }
    };

    updateSKU();
  }, [selectedCategory, editingProduct, categorySelected, categories]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "category_id") {
      const selectedCategoryId = value ? Number(value) : null;
      setSelectedCategory(selectedCategoryId);
      setCategorySelected(true);
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

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let formIsValid = true;
    let errors: { [field: string]: string } = {};
    let fileUrl = currentProduct?.image_url || null;

    if (!productSKU) {
      errors.SKU = "SKU is required";
      formIsValid = false;
    } else if (productSKU.length < 1 || productSKU.length > 15) {
      errors.SKU = "Must be between 1 and 15 characters.";
      formIsValid = false;
    }

    if (selectedCategory === null) {
      errors.category = "Category is required";
      formIsValid = false;
    }

    if (!productName) {
      errors.name = "Product name is required";
      formIsValid = false;
    }

    if (!productSize) {
      errors.size = "Size is required";
      formIsValid = false;
    }

    if (!productColor) {
      errors.color = "Color is required";
      formIsValid = false;
    }

    if (productPrice === '') {
      errors.price = "Price is required";
      formIsValid = false;
    } else if (parseFloat(productPrice) < 0) {
      errors.price = "Must be a positive number";
      formIsValid = false;
    }

    // Check for duplicates
    const isDuplicate = products.some(
      (product) =>
        product.name.toLowerCase() === productName.toLowerCase() &&
        product.size === productSize &&
        product.color.toLowerCase() === productColor.toLowerCase() &&
        (!editingProduct || product.id !== currentProduct?.id) // Exclude current product in edit mode
    );

    if (isDuplicate) {
      errors.duplicate = 'Duplicate product variation not allowed.';
      formIsValid = false;
    }

    // Handle image upload
    if (productImage) {
      const formData = new FormData();
      formData.append('file', productImage);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        fileUrl = data.url;
      }
    }

    setValidationErrors(errors);

    if (!formIsValid) {
      return;
    }

    const updatedProduct: Product = {
      id: currentProduct ? currentProduct.id : Date.now(),
      SKU: productSKU,
      category_id: Number(selectedCategory),
      name: productName,
      price: parseFloat(productPrice),
      quantity: currentProduct ? currentProduct.quantity : 1,
      size: productSize,
      color: productColor,
      image_url: fileUrl,
    };

    try {
      if (editingProduct) {
        await saveProduct(updatedProduct);
      } else {
        await addProduct(updatedProduct);
      }

      // Clear form after successful submission
      setProductSKU('');
      setProductName('');
      setProductSize('');
      setProductColor('');
      setProductPrice('');
      setSelectedCategory(null);
      setValidationErrors({});
      setCategorySelected(false);
      setProductImage(null);
      setProductImagePreview(null);
      onClose();
    } catch (error) {
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div className={styles.modalContent}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.modalHeading}>
          {editingProduct ? 'Edit Product' : 'Add Product'}
        </h2>

        {/* Main Form */}
        <form onSubmit={handleFormSubmit}>
          <label className={styles.modalInputLabel}>
            Category
          </label>
          <select
            name="category_id"
            value={selectedCategory || ''}
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
            SKU
          </label>
          <input
            type="text"
            name="SKU"
            placeholder={validationErrors.SKU || "SKU"}
            value={productSKU || ''}
            readOnly
            maxLength={15}
            className={`${styles.modalInput} ${validationErrors.SKU ? styles.inputError : ''} ${editingProduct ? styles.readOnlyInput : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Name
          </label>
          <input
            type="text"
            name="name"
            placeholder={validationErrors.name || "Product Name"}
            value={productName || ''}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.name ? styles.inputError : ''}`}
          />

          <label className={styles.modalInputLabel}>
            Size
          </label>
          <select
            name="size"
            value={productSize || ''}
            onChange={handleInputChange}
            className={`${styles.modalSelect} ${validationErrors.size ? styles.inputError : ''}`}
          >
            <option value="">{validationErrors.size || "Select Size"}</option>
            <option value="XXS">XXS</option>
            <option value="XS">XS</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
            <option value="N/A">N/A</option>
          </select>

          <label className={styles.modalInputLabel}>
            Color
          </label>
          <input
            type="text"
            name="color"
            placeholder={validationErrors.color || "Color"}
            value={productColor || ''}
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
            value={productPrice || ''}
            onChange={handleInputChange}
            className={`${styles.modalInput} ${validationErrors.price ? styles.inputError : ''}`}
            min="0"
          />

          {validationErrors.duplicate && (
            <div className={styles.errorText}>{validationErrors.duplicate}</div>
          )}

          <label className={styles.modalInputLabel}>Product Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setProductImage(file);
                setProductImagePreview(URL.createObjectURL(file));
              }
            }}
            className={styles.modalInput}
          />
          {productImagePreview && <img src={productImagePreview} alt="Preview" className={styles.imagePreview} />}

          <div className={styles.modalMediumButtonContainer}>
            {editingProduct && (
              <button
                type="button"
                onClick={onClose}
                className={styles.modalMediumButton}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className={styles.modalMediumButton}
              disabled={loading}
            >
              {editingProduct ? 'Save Product' : 'Add Product'}
            </button>
          </div>

        </form >
      </div >
    </div >
  );
};

export default ProductForm;
