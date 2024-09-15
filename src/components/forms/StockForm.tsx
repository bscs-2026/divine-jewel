import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';
import { ArrowBack } from '@mui/icons-material';

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
    name: string;
    address_line: string;
}

interface StockFormProps {
    products: Product[];
    branches: Branch[];
    selectedStocks: Stock[];
    isTransfer: boolean;
    addStock: (stock: Stock) => Promise<{ ok: boolean, message?: string }>;
    transferStock: (stockDetails: StockDetails) => Promise<{ ok: boolean, message?: string }>;
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
    const [errors, setErrors] = useState<string[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const inputValue = parseInt(value);
        const availableStock = selectedStocks[index].quantity;

        if (isTransfer && name === "quantity" && inputValue > availableStock) {
            setErrors((prev) => {
                const updatedErrors = [...prev];
                updatedErrors[index] = `Available stock is ${availableStock}.`;
                return updatedErrors;
            });
            return;
        }

        setErrors((prev) => {
            const updatedErrors = [...prev];
            updatedErrors[index] = "";
            return updatedErrors;
        });

        setFormDataList((prev) => {
            const updatedFormData = [...prev];
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        let formIsValid = true;
        let apiSuccess = false;
    
        await Promise.all(formDataList.map(async (formData, index) => {
            if (!formData.product_id || !formData.branch_code || isNaN(parseInt(formData.quantity))) {
                alert("Please fill all required fields correctly.");
                formIsValid = false;
                return;
            }
    
            try {
                let response;
                if (isTransfer) {
                    if (!destinationBranch) {
                        alert("Please select a destination branch for the transfer.");
                        formIsValid = false;
                        return;
                    }
                    const stockDetails = {
                        product_id: parseInt(formData.product_id),
                        source_branch: parseInt(formData.branch_code),
                        destination_branch: parseInt(destinationBranch),
                        quantity: parseInt(formData.quantity),
                        note: transferNote || '',
                    };
                    response = await transferStock(stockDetails);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully transferred!");
                        apiSuccess = true;
                    }
                } else {
                    const stock = {
                        ...selectedStocks[index],
                        product_id: parseInt(formData.product_id),
                        branch_code: parseInt(formData.branch_code),
                        quantity: parseInt(formData.quantity),
                    };
                    response = await addStock(stock);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully added!");
                        apiSuccess = true;
                    }
                }
            } catch (error) {
                console.error("An error occurred during the API request", error);
                formIsValid = false;
            }
        }));
    
        if (formIsValid && apiSuccess) {
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
                onClose();
            }, 2000);
        }
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
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
                                className={`${styles.modalSelect} ${destinationBranch === "" ? styles.placeholder : ""}`}
                            >
                                <option value="" disabled>
                                    Select destination branch
                                </option>
                                {branches.map((branch) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="text"
                                name="transfer_note"
                                placeholder="Note (Optional)"
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
                                    className={styles.modalInputFixed}
                                    min="1"
                                    {...(isTransfer ? { max: selectedStocks[index].quantity } : {})}
                                    placeholder={`Current qty. ${selectedStocks[index].quantity}`}
                                />
                                {errors[index] && <p className={styles.modalErrorText}>{errors[index]}</p>}
                            </div>
                        </div>
                    ))}

                    <div className={styles.modalMediumButtonContainer}>
                        <button
                            type="button"
                            className={`${styles.modalMediumButton} ${styles.modalBackButton}`}
                            onClick={() => onClose(false)}
                        >
                            <ArrowBack className={styles.modalBackButtonIcon} /> Back
                            <span className={styles.modalTooltipText}>Back to select more</span>
                        </button>
                        <button
                            type="submit"
                            className={`${styles.modalMediumButton}`}
                        >
                            {isTransfer ? 'Transfer Stock' : 'Add Stock'}
                        </button>
                    </div>
                </form>
            </div>

            {showSuccessModal && (
                <div className={`${styles.successModal} show`}>
                    <p>{successMessage}</p>
                </div>
            )}
        </div>
    );
};

export default StockForm;