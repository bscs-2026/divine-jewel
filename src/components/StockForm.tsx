import React, { useEffect, useState } from 'react';
import styles from './styles/Form.module.css';
import styles2 from './styles/Button.module.css';

interface Stock {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
    product_name: string;
    branch_name: string;
}

interface StockDetails {
    product_id: number;
    source_branch: number;
    destination_branch: number;
    quantity: number;
    note: string;
}

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
    selectedStock: Stock | null;
    isTransfer: boolean;
    addStock: (stock: Stock) => void;
    transferStock: (stockDetails: StockDetails) => void;
}

const StockForm: React.FC<StockFormProps> = ({
    products,
    branches,
    selectedStock,
    isTransfer,
    addStock,
    transferStock,
}) => {
    const initialFormData = {
        product_id: "",
        branch_code: "",
        destination_branch: "",
        note: "",
        quantity: ""
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (selectedStock) {
            setFormData({
                product_id: selectedStock.product_id.toString(),
                branch_code: selectedStock.branch_code.toString(),
                destination_branch: "",
                note: "",
                quantity: ""
            });
        }
    }, [selectedStock]);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isTransfer) {
            const stockDetails = {
                product_id: parseInt(formData.product_id),
                source_branch: parseInt(formData.branch_code),
                destination_branch: parseInt(formData.destination_branch),
                quantity: parseInt(formData.quantity),
                note: formData.note || '',
            };
            transferStock(stockDetails);
        } else {
            const stock = {
                ...selectedStock,
                product_id: parseInt(formData.product_id),
                branch_code: parseInt(formData.branch_code),
                quantity: parseInt(formData.quantity),
            };
            addStock(stock as Stock);
        }
        resetForm();
    };

    const resetForm = () => {
        setFormData(initialFormData);
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>
                {isTransfer ? 'Transfer Stock Qty.' : 'Add Stock Qty.'}
            </h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <select
                    name="product_id"
                    id="product_id"
                    className={styles.select}
                    value={formData.product_id}
                    onChange={handleInputChange}
                    required
                >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                {isTransfer ? (
                    <>
                        <select
                            name="branch_code"
                            id="source_branch"
                            className={styles.select}
                            value={formData.branch_code}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">
                                Select source branch
                            </option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>
                        <select
                            name="destination_branch"
                            id="destination_branch"
                            value={formData.destination_branch}
                            onChange={handleInputChange}
                            className={styles.select}
                            required
                        >
                            <option value="">Select destination branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            name="note"
                            id="note"
                            placeholder="Transfer Note (Optional)"
                            value={formData.note}
                            onChange={handleInputChange}
                            className={styles.input}
                        />
                    </>
                ) : (
                    <select
                        name="branch_code"
                        id="branch_code"
                        className={styles.select}
                        value={formData.branch_code}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">
                            Select a branch
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
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                />

                <button
                    type='submit'
                    className={`${styles2.smallButton} ${styles2.addButton}`}
                >
                    {isTransfer ? 'Transfer Stock' : 'Add Stock'}
                </button>
                <button
                    type='button'
                    className={`${styles2.smallButton} ${styles2.cancelButton}`}
                    onClick={resetForm}
                >   Cancel
                </button> 
            </form>
        </div>
    );
};

export default StockForm;