'use client';
import { useState, useEffect } from 'react';
import Layout from '../../components/PageLayout';
import CategoryTabs from '../../components/tabs/ProductCategoryOnTrans';
import ProductStocksTable from '../../components/tables/ProductListOnTrans';
import BranchFilter from '../../components/filters/StoreBranchOnTrans';
import OrderForm from '../../components/forms/Orders';
import { SuccessfulPrompt } from '@/components/prompts/Prompt';
import CircularIndeterminate from '@/components/loading/Loading';

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


  useEffect(() => {
    fetchData();
  }, [selectedBranch, selectedCategory]);

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
        const uniqueBranches = Array.from(new Set(
          productsData.map((product: Product) => ({
            branch_code: product.branch_code,
            branch_name: product.branch_name,
            branch_address: product.branch_address,
          }))
        ));

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

      <ProductStocksTable
        products={filteredProducts}
        onProductSelect={handleProductSelect}
        isDisabled={!selectedBranch}
      />

      <SuccessfulPrompt
        message="Order placed successfully!"
        isVisible={successOrderPrompt}
        onClose={() => setSuccessOrderPrompt(false)}
      />

    </Layout>
  );
}
