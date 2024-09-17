import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowDropUp, ArrowDropDown} from '@mui/icons-material';
import styles from '../styles/Form.module.css';

const OrderForm = ({ selectedProducts, setSelectedProducts, selectedBranch }) => {
    const [productQuantities, setProductQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = product.quantity || 0;
            return acc;
        }, {})
    );

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Cash');
    const [tenderedAmount, setTenderedAmount] = useState(0);
    const [currentDateTime, setCurrentDateTime] = useState({ date: '', time: '' });
    const [customerName, setCustomerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const updateDateTime = () => {
            const currentDate = new Date();
            const formattedDate = currentDate.toLocaleDateString('en-US', {
                timeZone: 'Asia/Manila',
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            });
            const formattedTime = currentDate.toLocaleTimeString('en-US', {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            });
            setCurrentDateTime({ date: formattedDate, time: formattedTime });
        };

        updateDateTime();
        const intervalId = setInterval(updateDateTime, 1000);

        return () => clearInterval(intervalId);
    }, [selectedProducts]);

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [successMessage]);

    const handleQuantityChange = (productId, delta) => {
        setProductQuantities((prevQuantities) => {
            const newQuantity = Math.max(0, (prevQuantities[productId] || 0) + delta);
            return { ...prevQuantities, [productId]: newQuantity };
        });
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.product_id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        setTenderedAmount(0);
    };

    const handleTenderedAmountChange = (event) => {
        setTenderedAmount(parseFloat(event.target.value) || 0);
    };

    const totalAmount = selectedProducts.reduce((total, product) => {
        const quantity = productQuantities[product.product_id] || 0;
        return total + (parseFloat(product.price) * quantity || 0);
    }, 0);

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        const change = tenderedAmount > totalAmount ? tenderedAmount - totalAmount : 0;

        const orderItems = selectedProducts.map(product => ({
            product_id: product.product_id,
            quantity: productQuantities[product.product_id],
            unit_price: parseFloat(product.price),
        }));

        const currentDate = new Date();
        const formattedDateTime = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

        const orderPayload = {
            date: formattedDateTime,
            customer_name: customerName,
            employee_id: 20,
            branch_code: selectedBranch ? selectedBranch.branch_code : 'Unknown',
            total_amount: totalAmount,
            order_items: orderItems,
            payment_method: selectedPaymentMethod,
            tendered_amount: selectedPaymentMethod === 'Cash' ? tenderedAmount : null,
            change: selectedPaymentMethod === 'Cash' ? change : null,
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessMessage('Order placed successfully!');
            } else {
                console.error('Failed to place order:', data.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const change = tenderedAmount > totalAmount ? tenderedAmount - totalAmount : 0;

    const isPlaceOrderDisabled = selectedPaymentMethod === 'Cash'
        ? tenderedAmount < totalAmount || totalAmount === 0
        : totalAmount === 0;

    const handleNewOrder = () => {
        setSelectedProducts([]);
        setProductQuantities({});
        setSelectedPaymentMethod('Cash');
        setTenderedAmount(0);
        setCustomerName('');
        setSuccessMessage(null);
    };

    return (
        <div className={styles.container}>
            {/* Order and Customer Details */}
            <div className={styles.orderDetails}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <div className={styles.heading2}>Current Order</div>
                        {/* <div className={styles.primary}>{selectedBranch?.branch_name || 'No Branch'}</div>
                        <div className={styles.secondary}>{selectedBranch?.branch_address || 'No Address'}</div> */}
                    </div>
                    {/* <div className={styles.verticalLine}></div> */}
                    {/* <div className={styles.headerRight}> */}
                        <div className={styles.primary}>Cashier: Divine Villanueva</div>
                        <div className={styles.primary}>Date : {currentDateTime.date}</div>
                        <div className={styles.primary}>Time : {currentDateTime.time}</div>
                        <div className={styles.primary}>{selectedBranch?.branch_name || 'No Branch'}</div>
                        <div className={styles.secondary}>{selectedBranch?.branch_address || 'No Address'}</div>
                    {/* </div> */}
                </div>
                <div className={styles.horizontalLine}></div>

                {/* Customer Name and Current Order */}
                <div className={styles.orderCustomerContainer}>
                    {/* <div className={styles.orderLeft}>
                        <div className={styles.heading2}>Current Order</div>
                    </div> */}
                    {/* <div className={styles.verticalLineShort}></div> */}
                    <div className={styles.customerRight}>
                        <input
                            type="text"
                            id="customerName"
                            placeholder="Customer name"
                            className={styles.customerNameInput}
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Product List */}
            <div className={styles.productListContainer}>
                <div className={styles.productList}>
                    {selectedProducts.map((product) => (
                        <div key={product.product_id} className={styles.productRow}>
                            <div>
                                <CloseIcon className={styles.removeIcon} onClick={() => handleRemoveProduct(product.product_id)} />
                            </div>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.productQuantityWrapper}>
                                <div className={styles.productQuantity}>
                                    <ArrowDropDown
                                        // className={styles.quantityButton}
                                        onClick={() => handleQuantityChange(product.product_id, -1)}
                                        disabled={productQuantities[product.product_id] === 0}
                                    />
                            
                                    <input
                                        type="text"
                                        className={styles.customInput}
                                        value={productQuantities[product.product_id]}
                                        readOnly
                                    />
                                    <ArrowDropUp
                                        // className={styles.quantityButton}
                                        onClick={() => handleQuantityChange(product.product_id, 1)}
                                    />
                                </div>
                            </div>
                            <div className={styles.productPrice}>{parseFloat(product.price).toFixed(2)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Payment Methods */}
            <div className={styles.paymentMethods}>
                <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'Cash' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('Cash')}>
                    Cash
                </button>
                <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'E-Wallet' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('E-Wallet')}>
                    E-Wallet
                </button>
                <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'Bank Transfer' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('Bank Transfer')}>
                    Bank Transfer
                </button>
            </div>

            {/* Total Amount and Cash Info */}
            <div className={styles.payRow}>
                <label>Total Amount:</label>
                <strong>{totalAmount.toFixed(2)}</strong>
            </div>

            {selectedPaymentMethod === 'Cash' && (
                <div className={styles.tenderAmount}>
                    <div className={styles.payRow}>
                        <label>Tendered Amount:</label>
                        <input
                            type="number"
                            className={styles.tenderedInput}
                            value={tenderedAmount === 0 ? '' : tenderedAmount}
                            onChange={handleTenderedAmountChange}
                        />
                    </div>
                    <div className={styles.payRow}>
                        <label>Change:</label>
                        <strong>{change.toFixed(2)}</strong>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className={styles.buttonsContainer}>
                <button
                    onClick={handleNewOrder}
                    className={styles.newOrderButton}
                >
                    New Order
                </button>
                
                <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading || isPlaceOrderDisabled}
                    className={styles.placeOrderButton}
                >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>

            {successMessage && (
                <div className={styles.modalOverlay} onClick={() => setSuccessMessage(null)}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeModalButton} onClick={() => setSuccessMessage(null)}>
                            &times;
                        </button>
                        <div>{successMessage}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderForm;
