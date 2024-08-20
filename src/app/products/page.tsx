// src/app/products/page.tsx
'use client';

import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import ProductTable from '../../components/ProductTable';
import CategoryTabs from '../../components/CategoryTabs';
import ProductForm from '../../components/ProductForm';

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  quantity: number;
  is_archive: number | boolean;
}

interface Category {
  id: number;
  name: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true); // Set loading to true before starting the fetch
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
      setLoading(false); // Set loading to false after the fetch is complete
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
  };

  const editProduct = (productId: number) => {
    const productToEdit = products.find(product => product.id === productId);
    if (productToEdit) {
      setCurrentProduct(productToEdit);
      setSelectedCategory(productToEdit.category_id);
      setEditingProduct(true);
    }
  };

  const saveProduct = async (product: Product) => {
    if (!currentProduct) return;
  
    const updatedProduct = {
      ...currentProduct,
      category_id: product.category_id || currentProduct.category_id,
      name: product.name || currentProduct.name,
      price: product.price !== undefined ? product.price : currentProduct.price,
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
  };

  const handleCancelEdit = () => {
    setEditingProduct(false);
    setCurrentProduct(null);
    setSelectedCategory(null);
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
        <Layout defaultTitle="Products" rightSidebarContent={
          <ProductForm
            categories={categories}
            currentProduct={currentProduct}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            editingProduct={editingProduct}
            handleCancelEdit={handleCancelEdit}
            addProduct={addProduct}
            saveProduct={saveProduct}
          />
        }>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
            <CategoryTabs
                categories={categories}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
            />
            <ProductTable
                products={products}
                filteredProducts={filteredProducts}
                editProduct={editProduct}
                archiveProduct={archiveProduct}
                unarchiveProduct={unarchiveProduct}
                filterCategory={filterCategory}
            />
            </>
          )}
        </Layout>
      );
}
    
