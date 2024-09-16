// src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import ProductTable from '../../components/tables/ProductTable';
import CategoryTabs from '../../components/tabs/CategoryTabs';
import ProductForm from '../../components/forms/ProductForm';
import ManageCategories from '../../components/forms/ManageCategories';
import Modal from '../../components/modals/Modal';

interface Product {
  id: number;
  SKU: string;
  category_id: number;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  is_archive: number | boolean;
}

interface Category {
  id: number;
  name: string;
  description: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | string | null>(null);
  const [showManageCategories, setShowManageCategories] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const toggleManageCategories = () => setIsManageCategoriesModalOpen(!isManageCategoriesModalOpen);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null); // Reset current product when closing modal
    setEditingProduct(false); // Reset editing mode
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data.products);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/products/category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const addCategory = async (category: Category) => {
    try {
      const response = await fetch('/api/products/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: category.name, description: category.description }),
      });

      if (!response.ok) {
        throw new Error('Failed to add category');
      }

      await fetchCategories();
    } catch (error: any) {
      setError(error.message);
    }
  }

  const deleteCategory = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this category?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/products/category/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories();
    } catch (error: any) {
      setError(error.message);
    }
  }


  const editCategory = async (category: Category) => {
    try {
      const response = await fetch(`/api/products/category/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        throw new Error('Failed to edit category');
      }

      await fetchCategories();
    } catch (error: any) {
      setError(error.message);
    }
  }

  const addProduct = async (product: Product) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      setCurrentProduct(null);
      setSelectedCategory(null);
      await fetchProducts();
    } catch (error: any) {
      setError(error.message);
    }
    // closeModal();
  };

  const editProduct = (productId: number) => {
    const productToEdit = products.find(product => product.id === productId);
    if (productToEdit) {
      setCurrentProduct(productToEdit);
      setSelectedCategory(productToEdit.category_id);
      setEditingProduct(true);
      openModal();
    }
  };

  const saveProduct = async (product: Product) => {
    if (!currentProduct) return;

    const updatedProduct = {
      ...currentProduct,
      SKU: product.SKU || currentProduct.SKU,
      category_id: product.category_id || currentProduct.category_id,
      name: product.name || currentProduct.name,
      price: product.price !== undefined ? product.price : currentProduct.price,
      size: product.size || currentProduct.size,
      color: product.color || currentProduct.color,
      quantity: product.quantity !== undefined ? product.quantity : currentProduct.quantity,
    };

    try {
      const response = await fetch(`/api/products/${currentProduct.id}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to save product');
      }

      setEditingProduct(false);
      setCurrentProduct(null);
      setSelectedCategory(null);
      await fetchProducts();
    } catch (error: any) {
      setError(error.message);
    }
    closeModal();
  };

  const handleCancelEdit = () => {
    setEditingProduct(false);
    setCurrentProduct(null);
    setSelectedCategory(null);
    closeModal();
  };

  const archiveProduct = async (productId: number) => {
    if (!productId) return;
    const confirmArchive = window.confirm('Are you sure you want to archive this product?');

    if (!confirmArchive) return;

    try {
      const response = await fetch(`/api/products/${productId}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_archive: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to archive product');
      }

      await fetchProducts();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const unarchiveProduct = async (productId: number) => {
    const confirmUnarchive = window.confirm('Are you sure you want to unarchive this product?');

    if (!confirmUnarchive) return;

    try {
      const response = await fetch(`/api/products/${productId}/archive`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_archive: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to unarchive product');
      }

      await fetchProducts();
    } catch (error: any) {
      setError(error.message);
    }
  };

  const activeProducts = products.filter(product => !product.is_archive);
  const archivedProducts = products.filter(product => product.is_archive);

  const filteredProducts = filterCategory === 'Archive'
    ? archivedProducts
    : filterCategory
      ? activeProducts.filter(product => product.category_id === filterCategory)
      : activeProducts;

  return (
    <Layout defaultTitle="Products">
      <CategoryTabs
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        toggleManageCategories={toggleManageCategories}
        handleAddProduct={openModal}
      />
      <ProductTable
        products={filteredProducts}
        editProduct={editProduct}
        archiveProduct={archiveProduct}
        unarchiveProduct={unarchiveProduct}
        filterCategory={filterCategory}
      />

      <Modal show={isModalOpen} onClose={closeModal}>
        <ProductForm
          categories={categories}
          currentProduct={currentProduct}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          editingProduct={editingProduct}
          handleCancelEdit={handleCancelEdit}
          addProduct={addProduct}
          saveProduct={saveProduct}
          onClose={closeModal}
        />
      </Modal>

      <Modal show={isManageCategoriesModalOpen} onClose={toggleManageCategories}>
        <ManageCategories
          categories={categories}
          addCategory={addCategory}
          editCategory={editCategory}
          deleteCategory={deleteCategory}
        />
      </Modal>
    </Layout>
  );
}
