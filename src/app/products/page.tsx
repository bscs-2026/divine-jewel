// src/app/products/page.tsx
'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Product {
    id: number;
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
    const [editProduct, setEditProduct] = useState<Product | null>(null);

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

    const handleEdit = (productId: number) => {

    };

    const handleSave = async (event: FormEvent) => {

    };

    return (
        <div className='container'>
            <div className='input-form'>
                <h1>{editProduct ? 'Edit Product' : 'Add Product'}</h1>
                <form onSubmit={editProduct ? handleSave : addProduct}>
                    <label htmlFor='category_id'>Category:</label>
                    <select name="category_id" id="category_id" defaultValue={editProduct?.category_id}>
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    <label htmlFor='name'>Name:</label>
                    <input type='text' id='name' name='name' defaultValue={editProduct?.name} />

                    <label htmlFor='price'>Price:</label>
                    <input type='number' id='price' name='price' defaultValue={editProduct?.price} />

                    <button type='submit'>{editProduct ? 'Save' : 'Add Product'}</button>
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
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.id}</td>
                                <td>{product.category_name}</td>
                                <td>{product.name}</td>
                                <td>{product.price}</td>
                                <td>{product.stock}</td>
                                <td>
                                <button onClick={() => handleEdit(product.id)}>Edit</button>
                                    <button>Archive</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}