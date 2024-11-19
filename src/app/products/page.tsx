'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/layout/Layout';
import ProductTable from '@/components/tables/ProductTable';
import CategoryTabs from '@/components/tabs/CategoryTabs';
import ProductForm from '@/components/forms/ProductForm';
import ManageCategories from '@/components/forms/ManageCategories';
import { DeletePrompt, SuccessfulPrompt } from '@/components/prompts/Prompt';
import CircularIndeterminate from '@/components/loading/Loading';
import Modal from '@/components/modals/Modal';
import StockHistoryTable from '@/components/tables/StockHistoryTable';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageCategoriesModalOpen, setIsManageCategoriesModalOpen] = useState(false);
  const [sucessAddProductPrompt, setsucessAddProductPrompt] = useState<boolean>(false);
  const [successEditProductPrompt, setSuccessEditProductPrompt] = useState<boolean>(false);
  const [sucessArchiveProductPrompt, setsucessArchiveProductPrompt] = useState<boolean>(false);
  const [sucessUnarchiveProductPrompt, setsucessUnarchiveProductPrompt] = useState<boolean>(false);
  const [sucessAddCateory, setSuccessAddCategory] = useState<boolean>(false);
  const [successEditCategory, setSuccessEditCategory] = useState<boolean>(false);
  const [successDeleteCategory, setSuccessDeleteCategory] = useState<boolean>(false);

  // New state variables for stock history modal
  const [isStockHistoryModalOpen, setIsStockHistoryModalOpen] = useState(false);
  const [stockHistoryData, setStockHistoryData] = useState<any[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const toggleManageCategories = () => setIsManageCategoriesModalOpen(!isManageCategoriesModalOpen);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
    setEditingProduct(false);
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
    setLoading(true);
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
      setSuccessAddCategory(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCategory = async (id: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/products/category/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      await fetchCategories();
      setSuccessDeleteCategory(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editCategory = async (category: Category) => {
    setLoading(true);
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
      setSuccessEditCategory(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Product) => {
    setLoading(true);
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
      setsucessAddProductPrompt(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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
      setLoading(true);
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
      setSuccessEditProductPrompt(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
      closeModal();
    }
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
      setLoading(true);
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
      setsucessArchiveProductPrompt(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const unarchiveProduct = async (productId: number) => {
    const confirmUnarchive = window.confirm('Are you sure you want to unarchive this product?');

    if (!confirmUnarchive) return;

    try {
      setLoading(true);
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
      setsucessUnarchiveProductPrompt(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // New function to view stock history
  const viewStockHistory = async (productId: number) => {
    try {
      setLoading(true);

      // Fetch data from the three APIs
      const [stockHistoryRes, orderHistoryRes, returnHistoryRes] = await Promise.all([
        fetch(`/api/products/${productId}/stockDetailsHistory`),
        fetch(`/api/products/${productId}/orderHistory`),
        fetch(`/api/products/${productId}/returnHistory`),
      ]);

      if (!stockHistoryRes.ok || !orderHistoryRes.ok || !returnHistoryRes.ok) {
        throw new Error('Failed to fetch stock history data');
      }

      const [stockHistoryData, orderHistoryData, returnHistoryData] = await Promise.all([
        stockHistoryRes.json(),
        orderHistoryRes.json(),
        returnHistoryRes.json(),
      ]);

      // Process and standardize data
      const processedStockHistoryData = processStockHistoryData(stockHistoryData.stockHistory || []);
      const processedOrderHistoryData = processOrderHistoryData(orderHistoryData.orderHistory || []);
      const processedReturnHistoryData = processReturnHistoryData(returnHistoryData.returnHistory || []);

      // Combine and sort data by date
      const combinedData = [
        ...processedStockHistoryData,
        ...processedOrderHistoryData,
        ...processedReturnHistoryData,
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setStockHistoryData(combinedData);
      setIsStockHistoryModalOpen(true);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Data processing functions
  const processStockHistoryData = (data: any[]) =>
    data.map(item => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.batch_id || '',
      source_branch: item.source_branch || '',
      destination_branch: item.destination_branch || '',
      employee: item.employee_name || '',
      reason: item.reason || '',
      note: item.note || '',
    }));

  const processOrderHistoryData = (data: any[]) =>
    data.map(item => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.order_id || '',
      source_branch: item.source_branch || '',
      destination_branch: '',
      employee: item.employee_name || '',
      reason: '',
      note: '',
    }));

  const processReturnHistoryData = (data: any[]) =>
    data.map(item => ({
      date: item.date,
      action: item.action,
      quantity: item.quantity,
      reference_id: item.order_id || '',
      source_branch: item.source_branch || '',
      destination_branch: '',
      employee: item.employee_name || '',
      reason: item.reason || '',
      note: '',
    }));

  // Filter products based on search query and selected category or archived status
  const filteredProducts =
    filterCategory === 'Archive'
      ? products.filter(
          product => product.is_archive && product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : filterCategory
      ? products.filter(
          product =>
            product.category_id === filterCategory &&
            !product.is_archive &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : products.filter(
          product => !product.is_archive && product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

  return (
    <Layout defaultTitle="Products">
      {loading && <CircularIndeterminate />}

      <CategoryTabs
        categories={categories}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        toggleManageCategories={toggleManageCategories}
        handleAddProduct={openModal}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ProductTable
        products={filteredProducts}
        editProduct={editProduct}
        archiveProduct={archiveProduct}
        unarchiveProduct={unarchiveProduct}
        filterCategory={filterCategory}
        viewStockHistory={viewStockHistory} // Add this line
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

      {/* Stock History Modal */}
      <Modal show={isStockHistoryModalOpen} onClose={() => setIsStockHistoryModalOpen(false)}>
        <StockHistoryTable data={stockHistoryData} />
      </Modal>

      <SuccessfulPrompt
        message="Product added successfully"
        isVisible={sucessAddProductPrompt}
        onClose={() => setsucessAddProductPrompt(false)}
      />
      <SuccessfulPrompt
        message="Product updated successfully"
        isVisible={successEditProductPrompt}
        onClose={() => setSuccessEditProductPrompt(false)}
      />
      <SuccessfulPrompt
        message="Product archived successfully"
        isVisible={sucessArchiveProductPrompt}
        onClose={() => setsucessArchiveProductPrompt(false)}
      />
      <SuccessfulPrompt
        message="Product unarchived successfully"
        isVisible={sucessUnarchiveProductPrompt}
        onClose={() => setsucessUnarchiveProductPrompt(false)}
      />
      <SuccessfulPrompt
        message="Category added successfully"
        isVisible={sucessAddCateory}
        onClose={() => setSuccessAddCategory(false)}
      />
      <SuccessfulPrompt
        message="Category updated successfully"
        isVisible={successEditCategory}
        onClose={() => setSuccessEditCategory(false)}
      />
      <DeletePrompt
        message="Category deleted successfully"
        isVisible={successDeleteCategory}
        onClose={() => setSuccessDeleteCategory(false)}
      />
    </Layout>
  );
}
