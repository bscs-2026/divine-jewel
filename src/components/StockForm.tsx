import React, { useState, FormEvent } from 'react';
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
    transferStock: (event: FormEvent) => void;
    error: string | null;
    selectedStock: {
        id: number;
        branch_name: string;
        quantity: number;
    } | null;
    isTransfer: boolean;

}

const StockForm: React.FC<StockFormProps> = ({ 
    products, 
    branches, 
    addStock, 
    transferStock,
    selectedStock,
    isTransfer,
    error 
}) => {

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}> 
                {isTransfer ? 'Transfer Stock Qty.' : 'Add Stock Qty.'}
            </h2>
            <form 
                onSubmit={isTransfer ? transferStock : addStock} 
                className={styles.form}
            >
                <select className={styles.select} value={isTransfer ? 'transfer' : 'add'} disabled>
                    <option value="add">Add Stock</option>
                    <option value="transfer">Transfer Stock</option>
                </select>

                <select name="product_id" id="product_id" className={styles.select} defaultValue={selectedStock?.id || ""}>
                    <option value="">Select a product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                {isTransfer ? (
                    <>
                        <select name="source_branch" id="source_branch" className={styles.select}>
                            <option value={selectedStock?.branch_name || ""}>
                                {selectedStock?.branch_name || "Select source branch"}
                            </option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>
                        <select name="destination_branch" id="destination_branch" className={styles.select}>
                            <option value="">Select destination branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>
                    </>
                ) : (
                    <select name="branch_code" id="branch_code" className={styles.select} defaultValue={selectedStock?.branch_name || ""}>
                        <option value={selectedStock?.branch_name || ""}>
                            {selectedStock?.branch_name || "Select a branch"}
                        </option>
                        {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                                {branch.address_line}
                            </option>
                        ))}
                    </select>
                )}

                <input 
                    type='number' 
                    id='quantity' 
                    name='quantity'
                    placeholder='Quantity'
                    className={styles.input} 
                    // defaultValue={selectedStock?.quantity || ""}
                />

                <button 
                    type='submit' 
                    className={`${styles2.smallButton} ${styles2.addButton}`}
                >
                    {isTransfer ? 'Transfer Stock' : 'Add Stock'}
                </button>

                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default StockForm;
