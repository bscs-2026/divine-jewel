// src/components/forms/StockForm.tsx

import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

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
    selectedStocks: Stock[];
    isTransfer: boolean;
    addStock: (stock: Stock) => void;
    transferStock: (stockDetails: StockDetails) => void;
    onClose: () => void;
}

const StockForm: React.FC<StockFormProps> = ({
    products,
    branches,
    selectedStocks,
    isTransfer,
    addStock,
    transferStock,
    onClose
}) => {
    const [formDataList, setFormDataList] = useState(
        selectedStocks.map((stock) => ({
            product_id: stock.product_id.toString(),
            branch_code: stock.branch_code.toString(),
            quantity: "",
            note: "",
        }))
    );

    const [destinationBranch, setDestinationBranch] = useState("");
    const [transferNote, setTransferNote] = useState("");
    const [lastAction, setLastAction] = useState<boolean | null>(null);

    useEffect(() => {
        setFormDataList(
            selectedStocks.map((stock) => ({
                product_id: stock.product_id ? stock.product_id.toString() : "",
                branch_code: stock.branch_code ? stock.branch_code.toString() : "",
                quantity: "",
                note: "",
            }))
        );
    }, [selectedStocks]);

    useEffect(() => {
        if (lastAction !== null && lastAction !== isTransfer) {
            setFormDataList(
                selectedStocks.map((stock) => ({
                    product_id: stock.product_id ? stock.product_id.toString() : "",
                    branch_code: stock.branch_code ? stock.branch_code.toString() : "",
                    quantity: "",
                    note: "",
                }))
            );
            setDestinationBranch("");
            setTransferNote("");
        }
        setLastAction(isTransfer);
    }, [isTransfer, selectedStocks, lastAction]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const { name, value } = e.target;

        if (name === "quantity" && parseInt(value) < 0) {
            return;
        }

        setFormDataList((prev) => {
            const updatedFormData = [...prev];
            // Cast name as keyof the object to ensure TypeScript knows it's a valid key
            updatedFormData[index] = {
              ...updatedFormData[index],
              [name]: value,
            };
            return updatedFormData;
        });
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setDestinationBranch(e.target.value);
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTransferNote(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        formDataList.forEach((formData, index) => {
            if (!formData.product_id || !formData.branch_code || isNaN(parseInt(formData.quantity))) {
                alert("Please fill all required fields correctly.");
                return;
            }

            if (isTransfer) {
                if (!destinationBranch) {
                    alert("Please select a destination branch for the transfer.");
                    return;
                }
                const stockDetails = {
                    product_id: parseInt(formData.product_id),
                    source_branch: parseInt(formData.branch_code),
                    destination_branch: parseInt(destinationBranch),
                    quantity: parseInt(formData.quantity),
                    note: transferNote || '',
                };
                transferStock(stockDetails);
            } else {
                const stock = {
                    ...selectedStocks[index],
                    product_id: parseInt(formData.product_id),
                    branch_code: parseInt(formData.branch_code),
                    quantity: parseInt(formData.quantity),
                };
                addStock(stock);
            }
        });
    };

    return (
        <div className={styles.modalContent}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>
                    {isTransfer ? 'Transfer Stocks' : 'Add Stocks'}
                </h2>
                <form onSubmit={handleSubmit}>
                    {isTransfer && (
                        <div>
                            <select
                                name="destination_branch"
                                value={destinationBranch}
                                onChange={handleDestinationChange}
                                required
                                className={styles.modalSelect}
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
                                name="transfer_note"
                                placeholder="Transfer Note (Optional)"
                                value={transferNote}
                                onChange={handleNoteChange}
                                className={styles.modalInput}
                            />
                        </div>
                    )}

                    <div className={styles.modalInputHeaderContainer}>
                        <span className={styles.modalInputLabel}>Qty.</span>
                    </div>

                    {formDataList.map((formData, index) => (
                        <div key={index} className={styles.modalItem}>
                            <div>
                                <p className={styles.modalPrimary}>{selectedStocks[index]?.product_name}</p>
                                <p className={styles.modalSecondary}>{selectedStocks[index]?.branch_name}</p>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                    className={styles.modalInput}
                                    min="1"
                                />
                            </div>
                        </div>
                    ))}
                    <div className={styles.modalButtonContainer}>
                        <button
                            type="button"
                            className={`${styles.modalButton}`}
                            onClick={onClose}
                        >
                            Select more
                        </button>
                        <button
                            type="submit"
                            className={`${styles.modalButton}`}
                        >
                            {isTransfer ? 'Transfer Stock' : 'Add Stock'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockForm;
