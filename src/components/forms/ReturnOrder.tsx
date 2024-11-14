'use client';

import React, { useState, useEffect } from 'react';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import styles from '../styles/Modal.module.css';
import { formatDate } from '../../lib/helpers';
import { SuccessfulPrompt } from '@/components/prompts/Prompt';

interface ReturnOrderProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReturnItem {
    productCode: string;
    quantity: number;
    reason: string;
}

const employeeFullname = 'Divine Villanueva';

const ReturnOrder: React.FC<ReturnOrderProps> = ({ isOpen, onClose }) => {
    const [orderId, setOrderId] = useState<string>('');
    const [orderIdError, setOrderIdError] = useState<string | null>(null);
    const [customerName, setCustomerName] = useState<string | null>(null); // New field for customer name
    const [returnItems, setReturnItems] = useState<ReturnItem[]>([
        { productCode: '', quantity: 1, reason: '' },
    ]);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [showSuccessPrompt, setShowSuccessPrompt] = useState<boolean>(false);
    const [validationErrors, setValidationErrors] = useState<{ [index: number]: { [field: string]: string } }>({});

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatDate(now.toISOString(), 'Asia/Manila'));
        };
        updateTime();
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    const resetForm = () => {
        setOrderId('');
        setCustomerName(''); // Reset customer name
        setOrderIdError(null);
        setReturnItems([{ productCode: '', quantity: 1, reason: '' }]);
        setValidationErrors({});
        setShowSuccessPrompt(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleInputChange = (index: number, field: keyof ReturnItem, value: string | number) => {
        const updatedItems = [...returnItems];
        updatedItems[index] = { ...updatedItems[index], [field]: value };
        setReturnItems(updatedItems);
    };

    const handleAddItem = () => {
        setReturnItems([...returnItems, { productCode: '', quantity: 1, reason: '' }]);
    };

    const handleRemoveItem = (index: number) => {
        setReturnItems(returnItems.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        let isValid = true;
        const errors: { [index: number]: { [field: string]: string } } = {};

        if (!orderId.trim()) {
            setOrderIdError('Order ID is required');
            isValid = false;
        } else {
            setOrderIdError(null);
        }

        returnItems.forEach((item, index) => {
            const itemErrors: { [field: string]: string } = {};

            if (!item.productCode.trim()) {
                itemErrors.productCode = 'Product code / SKU is required';
                isValid = false;
            }
            if (item.quantity <= 0 || isNaN(item.quantity)) {
                itemErrors.quantity = 'Quantity must be greater than 0';
                isValid = false;
            }
            if (!item.reason.trim()) {
                itemErrors.reason = 'Reason for return is required';
                isValid = false;
            }

            if (Object.keys(itemErrors).length > 0) {
                errors[index] = itemErrors;
            }
        });

        setValidationErrors(errors);
        return isValid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch('/api/orders/return', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: parseInt(orderId),
                    returnItems,
                    employeeId: 1, // Placeholder for the employee ID
                    customerName: customerName || null, // Send customerName as null if not provided
                }),
            });

            if (response.ok) {
                setShowSuccessPrompt(true);
                console.log('Return Order Submitted:', { orderId, returnItems, customerName });
                setTimeout(() => {
                    setShowSuccessPrompt(false);
                    handleClose();
                }, 3000);
            } else {
                const errorData = await response.json();
                console.error('Failed to submit return:', errorData);
                alert('Error: ' + errorData.error);
            }
        } catch (error) {
            console.error('Error submitting return:', error);
            alert('Failed to submit return. Please try again.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalBackdrop} onClick={handleClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalContentScrollable}>
                    <h2 className={styles.modalHeading}>Return Order</h2>
                    <p><strong>Date & Time:</strong> {currentTime}</p>
                    <p><strong>Employee:</strong> {employeeFullname}</p>
                    <br />

                    <form onSubmit={handleSubmit}>
                        <div className={styles.modalItem}>
                            <label>Order ID</label>
                            <input
                                type="text"
                                className={`${styles.modalInputFixed} ${orderIdError ? styles.inputError : ''}`}
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value)}
                                placeholder={orderIdError || 'Enter Order ID'}
                            />
                        </div>

                        <div className={styles.modalItem}>
                            <label>Customer Name (Optional)</label>
                            <input
                                type="text"
                                className={styles.modalInputFixed}
                                value={customerName || ''}
                                onChange={(e) => setCustomerName(e.target.value || null)}
                                placeholder="Enter Customer Name"
                            />
                        </div>

                        {returnItems.map((item, index) => (
                            <div key={index}>
                                <p><strong>Item {index + 1}</strong></p>

                                <div className={styles.modalItem}>
                                    <label>Product Code / SKU</label>
                                    <input
                                        type="text"
                                        className={`${styles.modalInputFixed} ${validationErrors[index]?.productCode ? styles.inputError : ''}`}
                                        value={item.productCode}
                                        onChange={(e) => handleInputChange(index, 'productCode', e.target.value)}
                                        placeholder={validationErrors[index]?.productCode || 'Enter product code / SKU'}
                                    />
                                </div>

                                <div className={styles.modalItem}>
                                    <label>Quantity</label>
                                    <input
                                        type="number"
                                        className={`${styles.modalInputFixed} ${validationErrors[index]?.quantity ? styles.inputError : ''}`}
                                        value={item.quantity}
                                        onChange={(e) => handleInputChange(index, 'quantity', parseInt(e.target.value))}
                                        min={1}
                                        placeholder={validationErrors[index]?.quantity || 'Enter quantity'}
                                    />
                                </div>

                                <div className={styles.modalItem}>
                                    <label>Reason</label>
                                    <textarea
                                        className={`${styles.modalInputFixed} ${validationErrors[index]?.reason ? styles.inputError : ''}`}
                                        value={item.reason}
                                        onChange={(e) => handleInputChange(index, 'reason', e.target.value)}
                                        placeholder={validationErrors[index]?.reason || 'Enter reason'}
                                    />
                                </div>

                                <div className={styles.iconButtonContainer}>
                                    <RemoveCircleIcon onClick={() => handleRemoveItem(index)} className={styles.iconButton} />
                                </div>
                            </div>
                        ))}

                        <div className={styles.iconButtonContainer}>
                            <AddCircleIcon onClick={handleAddItem} className={styles.iconButton} />
                        </div>

                        <div className={styles.modalMediumButtonContainer}>
                            <button type="submit" className={styles.modalMediumButton}>
                                Submit
                            </button>
                        </div>
                    </form>

                    <SuccessfulPrompt
                        message="Return order submitted successfully!"
                        isVisible={showSuccessPrompt}
                        onClose={() => setShowSuccessPrompt(false)}
                    />
                </div>
            </div>
        </div>
    );
};

export default ReturnOrder;
