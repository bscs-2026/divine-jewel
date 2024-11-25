import React, { use, useEffect, useState } from 'react';
import styles from '@/components/styles/Modal.module.css';
import { ArrowBack } from '@mui/icons-material';
import { generateBatchID } from '@/lib/generatorHelper';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface Stock {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
    damaged: number;
    product_name: string;
    branch_name: string | undefined;
    product_SKU: string;
    category_name: string;
    product_size: string;
    product_color?: string;
}

interface StockDetails {
    batch_id: string;
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
    addStock: (stock: Stock, batch_id: string, note: string) => Promise<{ ok: boolean, message?: string }>;
    isStockOut: boolean;
    stockOut: (stock: Stock, batch_id: string, note: string, stockOutReason: string) => Promise<{ ok: boolean, message?: string }>;
    isTransfer: boolean;
    markDamaged: (stock: Stock, batch_id: string, note: string) => Promise<{ ok: boolean, message?: string }>;
    isMarkDamaged: boolean;
    transferStock: (stockDetails: StockDetails) => Promise<{ ok: boolean, message?: string }>;
    loading: boolean;
    onClose: () => void;
}

const StockForm: React.FC<StockFormProps> = ({
    products,
    branches,
    selectedStocks,
    addStock,
    isStockOut,
    stockOut,
    isMarkDamaged,
    markDamaged,
    isTransfer,
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
    const [stockOutReason, setStockOutReason] = useState("");
    const [note, setNote] = useState("");
    const [lastAction, setLastAction] = useState<boolean | null>(null);
    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [batchID, setBatchID] = useState<string>("");
    const [currentTime, setCurrentTime] = useState<string>("");
    const [employeeName, setEmployeeName] = useState<string>("");
    const [employeeId, setEmployeeId] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const newBatchID = generateBatchID();
        setBatchID(newBatchID);
    }, []);

    useEffect(() => {
        const firstName = getCookieValue('first_name') || '';
        const lastName = getCookieValue('last_name') || '';
        const userName = `${firstName} ${lastName}`.trim();
        setEmployeeName(userName || 'N/A');
    
        const userId = parseInt(getCookieValue('user_id') || '', 10);
        setEmployeeId(!isNaN(userId) ? userId : null);
    }, []);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            }));
        };
        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        setFormDataList(
            selectedStocks.map((stock) => ({
                product_id: stock.product_id.toString(),
                branch_code: stock.branch_code.toString(),
                quantity: "",
                note: "",
            }))
        );
    }, [selectedStocks]);

    useEffect(() => {
        if (lastAction !== null && lastAction !== isTransfer) {
            setFormDataList(
                selectedStocks.map((stock) => ({
                    product_id: stock.product_id.toString(),
                    branch_code: stock.branch_code.toString(),
                    quantity: "",
                    note: "",
                }))
            );
            setDestinationBranch("");
            setStockOutReason("");
            setNote("");
        }
        setLastAction(isTransfer);
    }, [isTransfer, selectedStocks, lastAction]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { name, value } = e.target;
        const inputValue = parseInt(value);
        // Check available quantity based on the selected reason
        const availableStock = stockOutReason === "Damaged"
            ? selectedStocks[index].damaged // Use damaged quantity
            : selectedStocks[index].quantity; // Use current quantity


        if (isTransfer && name === "quantity" && inputValue > availableStock) {
            setErrors((prev) => {
                const updatedErrors = [...prev];
                updatedErrors[index] = `Available stock is ${availableStock}.`;
                return updatedErrors;
            });
            return;
        }

        if (isStockOut && name === "quantity" && inputValue > availableStock) {
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

    const handleStockOutReasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStockOutReason(e.target.value);
    };

    const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNote(e.target.value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let hasError = false;

        await Promise.all(formDataList.map(async (formData, index) => {
            if (!formData.product_id || !formData.branch_code || isNaN(parseInt(formData.quantity))) {
                alert("Please fill all required fields correctly.");
                return;
            }

            try {
                let response;
                if (isTransfer) {
                    if (!destinationBranch) {
                        alert("Please select a destination branch for the transfer.");
                        hasError = true;
                        return;
                    }
                    const stockDetails = {
                        batch_id: batchID,
                        product_id: parseInt(formData.product_id),
                        source_branch: parseInt(formData.branch_code),
                        destination_branch: parseInt(destinationBranch),
                        quantity: parseInt(formData.quantity),
                        employee_id: employeeId,
                        note: note || '',
                    };
                    response = await transferStock(stockDetails);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully transferred!");
                    } else {
                        hasError = true;
                    }
                } else if (isStockOut) {
                    if (!stockOutReason) {
                        alert("Please select a reason for stock out.");
                        hasError = true;
                        return;
                    }
                    const stock = {
                        ...selectedStocks[index],
                        product_id: parseInt(formData.product_id),
                        branch_code: parseInt(formData.branch_code),
                        quantity: parseInt(formData.quantity),
                        employee_id: employeeId,
                    };
                    response = await stockOut(stock, batchID, note, stockOutReason);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully marked as out!");
                    } else {
                        hasError = true;
                    }
                } else if (isMarkDamaged) {
                    const stock = {
                        ...selectedStocks[index],
                        product_id: parseInt(formData.product_id),
                        branch_code: parseInt(formData.branch_code),
                        quantity: parseInt(formData.quantity),
                        employee_id: employeeId,
                    };
                    response = await markDamaged(stock, batchID, note);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully marked as damaged!");
                    } else {
                        hasError = true;
                    }
                } else {
                    const stock = {
                        ...selectedStocks[index],
                        product_id: parseInt(formData.product_id),
                        branch_code: parseInt(formData.branch_code),
                        quantity: parseInt(formData.quantity),
                        employee_id: employeeId,
                    };
                    response = await addStock(stock, batchID, note);
                    if (response.ok) {
                        setSuccessMessage("Stock successfully added!");
                    } else {
                        hasError = true;
                    }
                }
            } catch (error) {
                console.error("An error occurred during the API request", error);
                hasError = true;
            }
        }));

        if (!hasError) {
            onClose();
        }
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
            <div className={styles.modalContentScrollable}>
                <h2 className={styles.modalHeading}>
                    {isTransfer ? 'Transfer Stocks' : isStockOut ? 'Stock Out' : isMarkDamaged ? 'Mark as Damaged' : 'Stock In'}
                </h2>

                {/* Display Batch ID */}
                <div className={styles.batchIDContainer}>
                    <p><strong>Batch ID:</strong> {batchID}</p>
                    <p>
                        <strong>Date & Time:</strong> {new Date().toLocaleDateString()} {currentTime}
                    </p>
                    <p><strong>Employee:</strong> {employeeName}</p>
                </div>
                <br />

                <form onSubmit={handleSubmit}>
                    {isTransfer && (
                        <div>
                            <label className={styles.modalInputLabel}>Destination Branch:</label>
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
                        </div>
                    )}

                    {isStockOut && (
                        <div>
                            <label className={styles.modalInputLabel}>Stock Out Reason:</label>
                            <select
                                value={stockOutReason}
                                onChange={handleStockOutReasonChange}
                                required
                                className={styles.modalSelect}
                            >
                                <option value="" disabled>Select reason</option>
                                <option value="Damaged">Damaged</option>
                                <option value="Misentry">Misentry</option>
                                <option value="Lost">Lost</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    )}

                    <input
                        type="text"
                        name="note"
                        placeholder="Note (Optional)"
                        value={note}
                        onChange={handleNoteChange}
                        className={styles.modalInput}
                    />
                    <br />

                    <div className={styles.modalItem}>
                        <h3 style={{ width: '330px' }}>Product Details</h3>
                        <h3 style={{ width: '150px' }}>
                            {stockOutReason === "Damaged" ? "Damaged Qty." : "Current Qty."}
                        </h3>
                        <h3 style={{ width: '100px' }}>{isTransfer ? 'Transfer' : isStockOut ? 'Stock Out' : isMarkDamaged ? 'Damaged Qty.' : 'Stock In'}</h3>
                    </div>

                    {formDataList.map((formData, index) => (
                        <div key={index} className={styles.modalItem}>
                            <div style={{ width: '350px' }}>
                                <p className={styles.modalPrimary}>{selectedStocks[index]?.product_name}</p>
                                <p className={styles.modalSecondary}>
                                    {selectedStocks[index]?.product_SKU} | {selectedStocks[index]?.product_size} | {selectedStocks[index]?.product_color}
                                </p>
                                <p className={styles.modalSecondary}>{selectedStocks[index]?.branch_name}</p>
                            </div>

                            <div style={{ width: '150px' }}>
                                <p className={styles.modalPrimary}>
                                    {stockOutReason === "Damaged"
                                        ? selectedStocks[index].damaged
                                        : selectedStocks[index].quantity}
                                </p>
                            </div>

                            <div style={{ width: '100px' }}>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={(e) => handleInputChange(e, index)}
                                    required
                                    className={styles.modalStockInputFixed}
                                    min="1"
                                    max={
                                        (isTransfer || isStockOut) // Apply max only for transfer or stock out
                                            ? stockOutReason === "Damaged"
                                                ? selectedStocks[index].damaged // Use damaged quantity for "Damaged" stock out reason
                                                : selectedStocks[index].quantity // Use current quantity for other stock out reasons
                                            : undefined // No max for add stock
                                    }
                                    placeholder={' qty.'}

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
                        </button>
                        <button
                            type="submit"
                            className={`${styles.modalMediumButton}`}
                            disabled={loading}
                        >
                            {isTransfer ? 'Transfer Stock' : isStockOut ? 'Stock Out' : isMarkDamaged ? 'Mark as Damaged' : 'Stock In'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StockForm;