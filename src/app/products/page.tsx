// src/app/products/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Product {
    id: number;
    category_id: number;
    name: string;
    price: number;
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

    // Filter products that are not archived
    const activeProducts = products.filter(product => product.is_archive === 0 || product.is_archive === false);

    return (
        <div className='container'>
            <div className='input-form'>
                <h1>{editingProduct ? 'Edit Product' : 'Add Product'}</h1>
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

                    <button type='submit'>{editingProduct ? 'Save' : 'Add'}</button>
                    {editingProduct && <button type='button' onClick={handleCancelEdit}>Cancel</button>}
                </form>
            </div>
            <br />
            <div className='table'>
                <h1>Products</h1>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Category</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeProducts.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.category_name}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                    <button onClick={() => editProduct(product.id)}>Edit</button>
                                    <button onClick={() => archiveProduct(product.id)}>Archive</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


