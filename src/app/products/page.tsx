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

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const [editingProduct, setEditingProduct] = useState<boolean>(false);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [listView, setListView] = useState<'active' | 'inactive'>('active');

    useEffect(() => {
        fetchProducts();
        fetchCategories();
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



    const addProduct = async (event: FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to add product');
            }

            form.reset();
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

    const saveProduct = async (event: FormEvent) => {
        event.preventDefault();
        if (!currentProduct) return;

        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        const updatedProduct = {
            category_id: data.category_id || currentProduct.category_id,
            name: data.name || currentProduct.name,
            price: data.price ? Number(data.price) : currentProduct.price,
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
            form.reset();
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

    const activeProducts = products.filter(product => product.is_archive === 0 || product.is_archive === false);
    const inactiveProducts = products.filter(product => product.is_archive === 1 || product.is_archive === true);

    return (
        <div>
            <div>
                <h1 className='font-bold'>Products</h1>
                <div>
                    <Link href="/products">
                        <button>Products</button>
                    </Link>
                    <Link href="/stocks">
                        <button>Stocks</button>
                    </Link>
                </div>

                <div>
                    <form onSubmit={editingProduct ? saveProduct : addProduct}>
                        <label htmlFor='category_id'>Category:</label>
                        <select
                            name="category_id"
                            id="category_id"
                            value={selectedCategory || ''}
                            onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <label htmlFor='name'>Name:</label>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={currentProduct?.name || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct!, name: e.target.value })}
                        />

                        <label htmlFor='price'>Price:</label>
                        <input
                            type='number'
                            id='price'
                            name='price'
                            value={currentProduct?.price || ''}
                            onChange={(e) => setCurrentProduct({ ...currentProduct!, price: Number(e.target.value) })}
                        />

                        <button type='submit'>{editingProduct ? 'Save' : 'Add Product'}</button>
                        {editingProduct && <button type='button' onClick={handleCancelEdit}>Cancel</button>}
                    </form>
                </div>

            </div>

            <br />

            <div>
                <div className='product-view-toggle'>
                    <button onClick={() => setListView('active')} className='px-1'>Active</button>
                    <button onClick={() => setListView('inactive')} className='px-1' >Inactive</button>
                </div>

                <table>
                    <thead>
                        <tr>
                            <th className="px-6 py-2 text-center">ID</th>
                            <th className="px-6 py-2 text-center">Category</th>
                            <th className="px-6 py-2 text-center">Name</th>
                            <th className="px-6 py-2 text-center">Price</th>
                            <th className="px-6 py-2 text-center">Stock</th>
                            <th >Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(listView === 'active' ? activeProducts : inactiveProducts).map((product) => (
                            <tr key={product.id}>
                                <td className='px-6'>{product.id}</td>
                                <td className='px-6'>{product.category_name}</td>
                                <td className='px-6'>{product.name}</td>
                                <td className='px-6'>{product.price}</td>
                                <td className='px-6'>{product.stock}</td>
                                <td>
                                    {listView === 'active' ? (
                                        <>
                                            <button onClick={() => editProduct(product.id)} className='px-1'>Edit</button>
                                            <button onClick={() => archiveProduct(product.id)} className='px-1'>Archive</button>
                                        </>
                                    ) : (
                                        <button onClick={() => unarchiveProduct(product.id)}>Unarchive</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}


