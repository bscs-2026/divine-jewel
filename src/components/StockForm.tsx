import React, { FormEvent } from 'react';
import styles from './styles/Form.module.css';
import styles2 from './styles/Button.module.css';

interface Product {
    id: number;
    name: string;
}

interface Branch {
    id: number;
    address_line: string;
}

interface StockFormProps {
    products: Product[];
    branches: Branch[];
    addStock: (event: FormEvent) => void;
    error: string | null;
}

const StockForm: React.FC<StockFormProps> = ({ products, branches, addStock, error }) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.heading}> Add Stock Qty.</h2>
            <form onSubmit={addStock} className={styles.form}>
                {/* <label htmlFor='product_id'>Product:</label> */}
                <select name="product_id" id="product_id" 
                className={styles.select}>
                    <option value="">Select a product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                {/* <label htmlFor='branch_code'>Branch:</label> */}
                <select name="branch_code" id="branch_code" 
                className={styles.select}>
                    <option value="">Select a branch</option>
                    {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                            {branch.address_line}
                        </option>
                    ))}
                </select>

                {/* <label htmlFor='quantity'>Quantity:</label> */}
                <input 
                    type='number' 
                    id='quantity' 
                    name='quantity'
                    placeholder='Quantity'
                    className={styles.input} />

                <button type='submit' className={`${styles2.smallButton} ${styles2.addButton}`}>Add Stock</button>

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default StockForm;
