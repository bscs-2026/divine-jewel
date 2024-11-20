import React, { useState } from 'react';
import styles from '@/components/styles/Modal.module.css';
import { ArrowBack } from '@mui/icons-material';
import Receipt from '@/components/modals/ReturnReceipt';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface ReturnItem {
    order_id: number;
    product_id: number;
    product_name: string;
    product_size: string;
    product_color: string;
    quantity: number;
    unit_price: number;
    unit_price_deducted: number;
    customer_name?: string;
    branch_name?: string;
    branch_address?: string;
    employee_id?: number;
    employee_fullname?: string;
}

interface ReturnItemsProps {
    selectedOrders: ReturnItem[];
    returnItem: (
        item: ReturnItem,
        returnQuantity: number,
        note: string
    ) => Promise<{ ok: boolean; message?: string }>;
    onClose: () => void;
}

const ReturnItemsForm: React.FC<ReturnItemsProps> = ({
    selectedOrders,
    returnItem,
    onClose,
}) => {
    const [formDataList, setFormDataList] = useState(
        selectedOrders.map(() => ({
            returnQuantity: '',
            note: '',
        }))
    );
    const [errors, setErrors] = useState<string[]>([]);
    const [globalMessage, setGlobalMessage] = useState<string | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [returnItemsData, setReturnItemsData] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false); // Add state to track submission

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number
    ) => {
        const { name, value } = e.target;

        setFormDataList((prev) => {
            const updatedFormData = [...prev];
            updatedFormData[index] = {
                ...updatedFormData[index],
                [name]: value,
            };
            return updatedFormData;
        });

        setErrors((prev) => {
            const updatedErrors = [...prev];
            updatedErrors[index] = '';
            return updatedErrors;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setGlobalMessage(null);
        setSubmitting(true); // Set submitting to true when submission starts

        const newErrors = formDataList.map((formData, index) => {
            const returnQuantity = parseInt(formData.returnQuantity, 10);
            if (isNaN(returnQuantity) || returnQuantity < 1) {
                return 'Please enter a valid return quantity.';
            }
            if (returnQuantity > selectedOrders[index].quantity) {
                return `Return quantity (${returnQuantity}) exceeds available stock (${selectedOrders[index].quantity}).`;
            }
            return '';
        });

        setErrors(newErrors);

        if (newErrors.some((error) => error)) {
            setSubmitting(false); // Reset submitting if errors exist
            return;
        }

        try {
            const results = await Promise.all(
                formDataList.map(async (formData, index) => {
                    const returnQuantity = parseInt(formData.returnQuantity, 10);
                    const note = formData.note || '';
                    const result = await returnItem(
                        selectedOrders[index],
                        returnQuantity,
                        note
                    );
                    return {
                        ...selectedOrders[index],
                        returnQuantity,
                        note,
                        success: result.ok,
                    };
                })
            );

            const success = results.every((result) => result.success);

            if (success) {
                setReturnItemsData(results);
                setShowReceipt(true);
            } else {
                const messages = results
                    .filter((result) => !result.success)
                    .map((result) => `Failed to return ${result.product_name}`)
                    .join(', ');
                setGlobalMessage(`Some errors occurred: ${messages}`);
            }
        } catch (error: any) {
            setGlobalMessage(error.message || 'An unexpected error occurred.');
        } finally {
            setSubmitting(false); // Reset submitting once submission is complete
        }
    };

    const handleClose = () => {
        setShowReceipt(false);
        setFormDataList(
            selectedOrders.map(() => ({
                returnQuantity: '',
                note: '',
            }))
        );
        setErrors([]);
        setGlobalMessage(null);
        onClose();
    };

    return (
        <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
            {showReceipt ? (
                <Receipt
                    returnItemsDatas={returnItemsData.map((item) => ({
                        product_id: item.product_id,
                        product_name: item.product_name,
                        product_size: item.product_size,
                        product_color: item.product_color,
                        quantity: item.quantity,
                        quantity_returned: item.returnQuantity,
                        unit_price: item.unit_price,
                        unit_price_deducted: item.unit_price_deducted,
                    }))}
                    returnItemsMetadata={{
                        order_id: selectedOrders[0].order_id,
                        customer_name: selectedOrders[0].customer_name || 'N/A',
                        branch_name: selectedOrders[0].branch_name || 'N/A',
                        branch_address: selectedOrders[0].branch_address || 'N/A',
                        employee_fullname: `${getCookieValue('first_name')} ${getCookieValue('last_name')}`,
                    }}
                    onClose={handleClose}
                />
            ) : (
                <div className={styles.modalContentScrollable}>
                    <h2 className={styles.modalHeading}>Return Items</h2>

                    {globalMessage && (
                        <p
                            className={
                                globalMessage.startsWith('All items')
                                    ? styles.successMessage
                                    : styles.errorMessage
                            }
                        >
                            {globalMessage}
                        </p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div
                            className={styles.modalItem}
                            style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
                        >
                            <h3 style={{ flex: '2', textAlign: 'left' }}>Product</h3>
                            <h3 style={{ flex: '1', textAlign: 'left' }}>Ordered</h3>
                            <h3 style={{ flex: '1', textAlign: 'left' }}>Return</h3>
                            <h3 style={{ flex: '3', textAlign: 'left' }}>Notes</h3>
                        </div>

                        {formDataList.map((formData, index) => (
                            <div
                                key={index}
                                className={styles.modalItem}
                                style={{ display: 'flex', gap: '20px', alignItems: 'center' }}
                            >
                                <div style={{ flex: '2' }}>
                                    <p>{selectedOrders[index].product_name}</p>
                                    <p>
                                        {selectedOrders[index].product_size}&emsp;{selectedOrders[index].product_color}
                                    </p>
                                </div>

                                <div style={{ flex: '1' }}>
                                    <p>{selectedOrders[index].quantity}</p>
                                </div>

                                <div style={{ flex: '1' }}>
                                    <input
                                        type="number"
                                        name="returnQuantity"
                                        value={formData.returnQuantity}
                                        onChange={(e) => handleInputChange(e, index)}
                                        required
                                        className={styles.modalReturnItemsInputFixed}
                                        min="1"
                                        max={selectedOrders[index].quantity}
                                        placeholder="Qty"
                                    />
                                    {errors[index] && <p className={styles.errorText}>{errors[index]}</p>}
                                </div>

                                <div style={{ flex: '3' }}>
                                    <textarea
                                        name="note"
                                        value={formData.note}
                                        onChange={(e) => handleInputChange(e, index)}
                                        placeholder="Optional notes"
                                        className={styles.modalReturnNote}
                                    />
                                </div>
                            </div>
                        ))}

                        <div className={styles.modalMediumButtonContainer}>
                            <button
                                type="button"
                                className={`${styles.modalMediumButton} ${styles.modalBackButton}`}
                                onClick={onClose}
                                disabled={submitting}
                            >
                                <ArrowBack /> Back
                            </button>
                            <button
                                type="submit"
                                className={`${styles.modalMediumButton}`}
                                disabled={submitting}
                            >
                                {submitting ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ReturnItemsForm;
