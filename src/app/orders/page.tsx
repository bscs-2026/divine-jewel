// src/app/orders/page.tsx

'use client';
import { useState, useEffect } from 'react';
import Layout from '@/components/PageLayout';
import CategoryTabs from '@/components/tabs/ProductCategoryOnTrans';
import ProductList from '@/components/tables/ProductListOnOrders';
import BranchFilter from '@/components/filters/StoreBranchOnOrders';
import OrderForm from '@/components/forms/Orders';
import { SuccessfulPrompt } from '@/components/prompts/Prompt';
import Modal from '@/components/modals/Modal';

interface Product {
  product_id: number;
  name: string;
  SKU: string;
  size: string;
  color: string;
  price: number | null | string;
  stock: number | null;
  branch_code: number;
  branch_address: string;
  branch_name: string;
  category_id: number;
  category_name: string;
  image_url: string;
}

interface Branch {
  branch_code: number;
  branch_name: string;
  branch_address: string;
}

export default function TransactionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [successOrderPrompt, setSuccessOrderPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []); // Only run on component mount

  useEffect(() => {
    const branchNameFromCookie = getCookieValue('branch_name');
    const branchIdFromCookie = getCookieValue('branch_id');

    if (branchNameFromCookie && branches.length > 0) {
      const matchingBranch = branches.find(
        branch => branch.branch_name === branchNameFromCookie || branch.branch_code.toString() === branchIdFromCookie
      );
      if (matchingBranch && selectedBranch?.branch_code !== matchingBranch.branch_code) {
        setSelectedBranch(matchingBranch);
      }
    }
  }, [branches]); // Run only when `branches` data is populated

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders/products');

      if (!response.ok) throw new Error(`Failed to fetch products: ${response.statusText}`);

      const data = await response.json();

      if (data.success) {
        const productsData = data.data;

        // Extract unique categories and branches from the data
        const uniqueCategories = Array.from(new Set(productsData.map((product: Product) => product.category_name)));
        const uniqueBranches = Array.from(
          new Set(
            productsData.map((product: Product) => ({
              branch_code: product.branch_code,
              branch_name: product.branch_name,
              branch_address: product.branch_address,
            }))
          )
        );

        setProducts(productsData);
        setCategories(uniqueCategories);
        setBranches(uniqueBranches);
      } else {
        throw new Error('Failed to load product data');
      }
    } catch (error: any) {
      console.error('Error occurred during data fetch:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filteredProducts = products;

    if (selectedBranch) {
      filteredProducts = filteredProducts.filter(
        (product) => product.branch_name === selectedBranch.branch_name
      );
    }

    if (selectedCategory) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category_name === selectedCategory
      );
    }

    return filteredProducts;
  };

  const handleBranchChange = (branch: Branch | null) => {
    setSelectedBranch(branch);
    setSelectedCategory(null);

    if (branch) {
      // Read the original expiry timestamp from a cookie
      const originalExpiry = getCookieValue('branch_id_expiry');

      if (originalExpiry) {
        // Calculate remaining `max-age` in seconds
        const remainingTime = Math.max(0, Math.floor((parseInt(originalExpiry) - Date.now()) / 1000));

        // Update the cookies with the remaining `max-age`
        document.cookie = `branch_id=${branch.branch_code}; path=/; max-age=${remainingTime}; SameSite=Lax`;
        document.cookie = `branch_name=${branch.branch_name}; path=/; max-age=${remainingTime}; SameSite=Lax`;
      } else {
        // Fallback to setting a new 7-day `max-age` if the original expiry is not found
        document.cookie = `branch_id=${branch.branch_code}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        document.cookie = `branch_name=${branch.branch_name}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
      }
    }
  };

  // Helper function to get a cookie by name
  const getCookieValue = (name: string) => {
    const matches = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
    return matches ? decodeURIComponent(matches[1]) : null;
  };


  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
  };

  const handleProductSelect = (product: Product) => {
    if (product.stock && product.stock > 0) {
      if (!selectedProducts.some(selectedProduct => selectedProduct.product_id === product.product_id)) {
        setSelectedProducts((prevSelected) => [...prevSelected, { ...product, stock: product.stock }]);
      }
    } else {
      console.warn('Cannot add product with no stock');
    }
  };

  const handleNewOrder = () => {
    setSelectedProducts([]);
    fetchData();
  };

  const handleOrderSuccess = () => {
    setSuccessOrderPrompt(true);
    setTimeout(() => setSuccessOrderPrompt(false), 3000);
  };

  const filteredProducts = filterProducts();

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Layout
      defaultTitle="Orders"
      rightSidebarContent={
        <OrderForm
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          selectedBranch={selectedBranch}
          onSuccess={handleOrderSuccess}
          reloadData={fetchData}
        />
      }
    >
      <BranchFilter
        branches={branches}
        selectedBranch={selectedBranch}
        onBranchChange={handleBranchChange}
      />
      <br />

      <CategoryTabs
        categories={categories}
        filterCategory={selectedCategory}
        setFilterCategory={handleCategoryChange}
      />

      <ProductList
        products={filteredProducts}
        onProductSelect={handleProductSelect}
        isDisabled={!selectedBranch}
        onThumbnailClick={(imageUrl) => setModalImage(imageUrl)}
        loading={loading}
      />

      {modalImage && (
        <Modal show={true} onClose={() => setModalImage(null)}>
          <img src={modalImage} alt="Full View" style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '10px' }} />
        </Modal>
      )}

      <SuccessfulPrompt
        message="Order placed successfully!"
        isVisible={successOrderPrompt}
        onClose={() => setSuccessOrderPrompt(false)}
      />
    </Layout>
  );
}
