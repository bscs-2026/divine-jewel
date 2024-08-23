'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/Layout';
import StockTable from '../../components/StockTable';
import StockForm from '../../components/StockForm';
import BranchTabs from '../../components/BranchTabs';

interface Stock {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
    product_name: string;
    branch_name: string;
}

interface Product {
    id: number;
    name: string;
    is_archive: number | boolean;
}

interface Branch {
    id: number;
    address_line: string;
}

interface StockDetails {
    product_id: number;
    source_branch: number;
    destination_branch: number;
    quantity: number;
    note: string;
}

export default function StocksPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isTransfer, setIsTransfer] = useState(false);
    const [filterBranch, setFilterBranch] = useState<number | string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchStocks();
        fetchBranches();
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            const activeProducts = data.products.filter((product: Product) => !product.is_archive); 
            setProducts(activeProducts);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const fetchStocks = async () => {
        try {
            const response = await fetch('/api/stocks');
            if (!response.ok) {
                throw new Error('Failed to fetch stocks');
            }
            const data = await response.json();
            setStocks(data.stocks);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch('/api/stocks/branches');
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
            setBranches(data.branches);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const addStock = async (stock: Stock) => {
        if (!stock.product_id || !stock.branch_code || isNaN(stock.quantity)) {
            setError('Please select a product, branch, and enter a valid quantity.');
            return;
        }

        try {
            const response = await fetch(`/api/stocks/${stock.product_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ branch_code: stock.branch_code, quantity: stock.quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            setError(null);
            setSelectedStock(null);
            await fetchStocks();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const transferStock = async (stockDetails: StockDetails) => {

        if (!stockDetails.product_id || !stockDetails.source_branch || !stockDetails.destination_branch || isNaN(stockDetails.quantity)) {
            setError('Please select a product, source branch, destination branch, and enter a valid quantity.');
            return;
        }

        try {
            const response = await fetch(`/api/stocks/stock_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: stockDetails.product_id,
                    source_branch: stockDetails.source_branch,
                    destination_branch: stockDetails.destination_branch,
                    quantity: stockDetails.quantity,
                    note: stockDetails.note,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to transfer stock');
            }

            setSelectedStock(null);
            setIsTransfer(false);
            await fetchStocks();
        } catch (error: any) {
            setError(error.message);
        }
    };

    const activeProductIds = products.map(product => product.id);
    const filteredStocks = stocks.filter(stock => 
        activeProductIds.includes(stock.product_id) &&
        (!filterBranch || stock.branch_code === filterBranch)
    );


    return (
        <Layout
            defaultTitle="Stocks"
            rightSidebarContent={
                <StockForm
                    products={products}
                    branches={branches}
                    addStock={addStock}
                    transferStock={transferStock}
                    selectedStock={selectedStock}
                    isTransfer={isTransfer}
                />
            }
        >
            <BranchTabs
                branches={branches}
                filterBranch={filterBranch}
                setFilterBranch={setFilterBranch}
            />

            <StockTable
                stocks={filteredStocks}
                setSelectedStock={setSelectedStock}
                setIsTransfer={setIsTransfer}
            />
        </Layout>
    );
}
