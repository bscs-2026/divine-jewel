import React, { useEffect, useState } from 'react';
import styles from '../styles/Form.module.css';
import styles2 from '../styles/Button.module.css';

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
}

const StockForm: React.FC<StockFormProps> = ({
    products,
    branches,
    selectedStocks,
    isTransfer,
    addStock,
    transferStock
}) => {
    const [formDataList, setFormDataList] = useState(
        selectedStocks.map((stock) => ({
            product_id: stock.product_id.toString(),
            branch_code: stock.branch_code.toString(),
            quantity: stock.quantity.toString(),
            note: "",
        }))
    );

    const [destinationBranch, setDestinationBranch] = useState("");
    const [transferNote, setTransferNote] = useState("");
    const [lastAction, setLastAction] = useState<boolean | null>(null);

    // Update formDataList whenever selectedStocks changes
    useEffect(() => {
        setFormDataList(
            selectedStocks.map((stock) => ({
                product_id: stock.product_id ? stock.product_id.toString() : "",
                branch_code: stock.branch_code ? stock.branch_code.toString() : "",
                quantity: stock.quantity ? stock.quantity.toString() : "",
                note: "",
            }))
        );
    }, [selectedStocks]);

    // Only reset form when switching between modes (Add and Transfer)
    useEffect(() => {
        if (lastAction !== null && lastAction !== isTransfer) {
            setFormDataList(
                selectedStocks.map((stock) => ({
                    product_id: stock.product_id || "",
                    branch_code: stock.branch_code || "",
                    quantity: stock.quantity || 0,
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
        setFormDataList((prev) => {
            const updatedFormData = [...prev];
            updatedFormData[index][name] = value;
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
            // Ensure valid inputs before proceeding
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
        <div className={styles.container}>
            <h2 className={styles.heading}>{isTransfer ? 'Transfer Stock Qty.' : 'Add Stock Qty.'}</h2>
            <form onSubmit={handleSubmit}>
                {isTransfer && (
                    <div className={styles.transferContainer}>
                        {/* Single Destination Branch select input for all products */}
                        <select
                            name="destination_branch"
                            value={destinationBranch}
                            onChange={handleDestinationChange}
                            required
                            className={styles.select}
                        >
                            <option value="">Select destination branch</option>
                            {branches.map((branch) => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.address_line}
                                </option>
                            ))}
                        </select>

                        {/* Single Transfer Note input for all products */}
                        <input
                            type="text"
                            name="transfer_note"
                            placeholder="Transfer Note (Optional)"
                            value={transferNote}
                            onChange={handleNoteChange}
                            className={styles.input}
                        />
                    </div>
                )}
                {formDataList.map((formData, index) => (
                    <div key={index} className={styles.stockItem}>
                        <div className={styles.productBranchContainer}>
                            <p className={styles.primary}>{selectedStocks[index]?.product_name}</p>
                            <p className={styles.secondary}>{selectedStocks[index]?.branch_name}</p>
                        </div>
                        <div className={styles.quantityContainer}>
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={(e) => handleInputChange(e, index)}
                                required
                                className={styles['custom-input']}
                            />
                        </div>
                    </div>
                ))}
                <br />
                <button
                    type="submit"
                    className={`${styles2.smallButton} ${styles2.addButton} ${styles2.alignRightButton}`}
                >
                    {isTransfer ? 'Transfer Stock' : 'Add Stock'}
                </button>
            </form>
        </div>
    );
};

export default StockForm;
