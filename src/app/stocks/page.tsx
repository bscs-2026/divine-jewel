'use client';
import { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import StockTable from '../../components/StockTable';
import StockForm from '../../components/StockForm';

interface Product {
    id: number;
    name: string;
}

interface Stock {
    id: number;
    product_id: number;
    product_name: string;
    branch_code: number;
    branch_name: string;
    quantity: number;
}

interface Branch {
    id: number;
    address_line: string;
}
interface StockDetails {
    product_id: number;
    source_branch: string;
    destination_branch: string;
    quantity: number;
    note: string;
}

export default function StocksPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);

    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
    const [isTransfer, setIsTransfer] = useState(false);

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
            setProducts(data.products);
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

    const addStock = async (event: FormEvent) => {
        event.preventDefault();

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const productId = data.product_id as string;
        const branchCode = data.branch_code as string;
        const quantity = Number(data.quantity);

        if (!productId || !branchCode || isNaN(quantity)) {
            setError('Please select a product, branch, and enter a valid quantity.');
            return;
        }

        try {
            const response = await fetch(`/api/stocks/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ branch_code: branchCode, quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            setError(null);
            form.reset();
            await fetchStocks();
        } catch (error: any) {
            setError(error.message);
        }
    };
    const transferStock = async (stockDetails: StockDetails) => {
        try {
            const { product_id, source_branch, destination_branch, quantity, note } = stockDetails;

            if (!product_id || !source_branch || !destination_branch || isNaN(quantity)) {
                setError('Please select a product, source branch, destination branch, and enter a valid quantity.');
                return;
            }

            const response = await fetch(`/api/stocks/stock_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id,
                    source_branch,
                    destination_branch,
                    quantity,
                    note: note || null,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to transfer stock');
            }

            setSelectedStock(null);
            setIsTransfer(false);
            await fetchStocks(); // Refresh the stocks after the transfer
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <Layout defaultTitle="Stocks" rightSidebarContent={
            <StockForm
                products={products}
                branches={branches}
                addStock={addStock}
                transferStock={transferStock}
                selectedStock={selectedStock}
                isTransfer={isTransfer}
                error={error}
            />
        }>
            <StockTable
                stocks={stocks}
                branches={branches}
                selectedBranch={selectedBranch}
                setSelectedBranch={setSelectedBranch}
                setSelectedStock={setSelectedStock}
                setIsTransfer={setIsTransfer}
            />
        </Layout>
    );
}
