// src/app/products/page.tsx
'use client';
import Link from 'next/link';

import { useEffect, useState, FormEvent } from 'react';

interface Product {
    id: number;
    category_id: number;
    name: string;
    price: number;
    quantity: number;
    is_archive: number | boolean;
    [key: string]: any;
}

interface Stocks {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
}

interface Branch {
    id: number;
    address_line: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Product[]>([]);
    const [branches, setBranch] = useState<Branch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedBranch, setSelectedBranch] = useState<string | null>(null);

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
    }
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
    }

    const fetchBranches = async () => {
        try {
            const response = await fetch('/api/stocks/branches');
            if (!response.ok) {
                throw new Error('Failed to fetch branches');
            }
            const data = await response.json();
            setBranch(data.branches);
        } catch (error: any) {
            setError(error.message);
        }
    }

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


    const activeProducts = products.filter(product => product.is_archive === 0 || product.is_archive === false);

    return (
        <div>
            <div>
                <h1 className='font-bold' >Stocks</h1>
                <div>
                    <Link href="/products">
                        <button>Products</button>
                    </Link>
                    <Link href="/stocks">
                        <button>Stocks</button>
                    </Link>
                </div>
                <div>
                    <form onSubmit={addStock}>
                        <label htmlFor='product_id'>Product:</label>
                        <select name="product_id" id="product_id">
                            <option value="">Select a product</option>
                            {activeProducts.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor='product_id'>Branch:</label>
                        <select name="branch_code" id="branch_code">
                            <option value="">Select a branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>

                        <label htmlFor='quantity'>Quantity:</label>
                        <input type='number' id='quantity' name='quantity' />

                        <button type='submit'>Add Stock</button>
                    </form>
                </div>
            </div>

            <br />

            <div className='table'>
                <div>
                    <label htmlFor='branch'>Branch:</label>
                    <select
                        name='branch'
                        id='branch'
                        value={selectedBranch || ''}
                        onChange={(e) => setSelectedBranch(e.target.value)}
                    >
                        <option value=''>All Branches</option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.address_line}
                            </option>
                        ))}
                    </select>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th className="px-6 py-2 text-center">Stock ID</th>
                            <th className="px-6 py-2 text-center">Product</th>
                            <th className="px-6 py-2 text-center">Branch</th>
                            <th className="px-6 py-2 text-center">Stock</th>
                            {/* <th >Actions</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {stocks.map((stocks) => (
                            <tr key={stocks.id}>
                                <td className='px-6'>{stocks.id}</td>
                                <td className='px-6'>{stocks.product_name}</td>
                                <td className='px-6'>{stocks.branch_name}</td>
                                <td className='px-6'>{stocks.stock}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}


