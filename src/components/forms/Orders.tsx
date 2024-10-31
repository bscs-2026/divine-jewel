import React, { useState, useEffect, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { AddBox, IndeterminateCheckBox, ArrowDropUp, ArrowDropDown, Add } from '@mui/icons-material';
import styles from '../styles/Form.module.css';
import { SuccessfulPrompt } from "@/components/prompts/Prompt";
import ReturnOrder from './ReturnOrder';
import { formatDate } from '../../lib/helpers';
import CircularIndeterminate from '@/components/loading/Loading';


const OrderForm = ({ selectedProducts, setSelectedProducts, selectedBranch }) => {
    const [productQuantities, setProductQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = product.quantity || 0;
            return acc;
        }, {})
    );

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const handleOpenReturnModal = () => setIsReturnModalOpen(true);
    const handleCloseReturnModal = () => setIsReturnModalOpen(false);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Cash');
    const [tenderedAmount, setTenderedAmount] = useState(0);
    const [selectedEWalletProvider, setSelectedEWalletProvider] = useState('G-Cash'); // Set default to 'G-Cash'
    const [referenceNumber, setReferenceNumber] = useState('');
    const [currentTimeTime, setcurrentTimeTime] = useState({ date: '', time: '' });
    const [customerName, setCustomerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successOrderPrompt, setSuccessOrderPrompt] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [discountedAmount, setDiscountedAmount] = useState(0);


    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(formatDate(now.toISOString(), 'Asia/Manila'));
        };
        updateTime();
        const intervalId = setInterval(updateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (successOrderPrompt) {
            const timer = setTimeout(() => {
                setSuccessOrderPrompt(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [successOrderPrompt]);

    useEffect(() => {
        const totalAmountBeforeDiscount = selectedProducts.reduce((total, product) => {
            const quantity = productQuantities[product.product_id] || 1;
            return total + (parseFloat(product.price) * quantity || 0);
        }, 0);

        const discount = (totalAmountBeforeDiscount * discountPercentage) / 100;
        setDiscountedAmount(totalAmountBeforeDiscount - discount);
    }, [discountPercentage, selectedProducts, productQuantities]);

    const handleQuantityChange = (productId, delta) => {
        setProductQuantities((prevQuantities) => {
            const newQuantity = Math.max(0, (prevQuantities[productId] || 1) + delta);
            return { ...prevQuantities, [productId]: newQuantity };
        });
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.product_id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handleTenderedAmountChange = (event) => {
        setTenderedAmount(parseFloat(event.target.value) || 0);
    };
    const handleEWalletProviderChange = (event) => {
        setSelectedEWalletProvider(event.target.value);
    };
    const handleReferenceNumberChange = (event) => {
        setReferenceNumber(event.target.value);
    };

    const totalAmountBeforeDiscount = useMemo(() => {
        return selectedProducts.reduce((total, product) => {
            const quantity = productQuantities[product.product_id] || 1;
            return total + (parseFloat(product.price) * quantity || 0);
        }, 0);
    }, [selectedProducts, productQuantities]);

    useEffect(() => {
        const discount = (totalAmountBeforeDiscount * discountPercentage) / 100;
        setDiscountedAmount(totalAmountBeforeDiscount - discount);
    }, [discountPercentage, totalAmountBeforeDiscount]);

    useEffect(() => {
        if (selectedPaymentMethod === 'E-Wallet') {
            if (discountPercentage > 0) {
                setTenderedAmount(discountedAmount);
            } else {
                setTenderedAmount(totalAmountBeforeDiscount);
            }
        }
    }, [selectedPaymentMethod, discountPercentage, discountedAmount, totalAmountBeforeDiscount]);

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        if (method === 'E-Wallet') {
            if (discountPercentage > 0) {
                setTenderedAmount(discountedAmount);
            } else {
                setTenderedAmount(totalAmountBeforeDiscount);
            }
        } else {
            setTenderedAmount(0);
        }
    };

    const handlePlaceOrder = async () => {
        setIsLoading(true);
        const change = tenderedAmount > discountedAmount ? tenderedAmount - discountedAmount : 0;

        const orderItems = selectedProducts.map(product => ({
            product_id: product.product_id,
            sku: product.SKU,
            quantity: productQuantities[product.product_id] || 1,
            unit_price: parseFloat(product.price),
        }));

        const formattedDateTime = formatDate(new Date().toISOString(), 'Asia/Manila');

        const orderPayload = {
            date: formattedDateTime,
            customer_name: customerName || null,
            employee_id: 20, // Fixed employee ID for now
            branch_code: selectedBranch ? selectedBranch.branch_code : null,
            total_amount: totalAmountBeforeDiscount,
            discount_percentage: discountPercentage || null,
            discounted_amount: discountedAmount || null,
            order_items: orderItems,
            payment_method: selectedPaymentMethod,
            tendered_amount: tenderedAmount,
            change: selectedPaymentMethod === 'Cash' ? change : null,
            reference_number: selectedPaymentMethod !== 'Cash' ? referenceNumber : null,
            e_wallet_provider: selectedPaymentMethod === 'E-Wallet' ? selectedEWalletProvider : null,
        };             

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccessOrderPrompt(true);
            } else {
                console.error('Failed to place order:', data.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const change = tenderedAmount > discountedAmount ? tenderedAmount - discountedAmount : 0;

    const isPlaceOrderDisabled = selectedPaymentMethod === 'Cash'
        ? tenderedAmount < discountedAmount || discountedAmount === 0
        : discountedAmount === 0;

    const handleNewOrder = () => {
        setSelectedProducts([]);
        setProductQuantities({});
        setSelectedPaymentMethod('Cash');
        setReferenceNumber('');
        setTenderedAmount(0);
        setCustomerName('');
        // setSuccessMessage(null);
    };

    return (
        <div className={styles.container}>
            {/* Order and Customer Details */}
            <div className={styles.orderDetails}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <div className={styles.heading2}>Current Order</div>
                    </div>
                    <div className={styles.primary}>Cashier: Divine Villanueva</div>
                    <div className={styles.primary}>Date & Time: {currentTime}</div>
                    <div className={styles.primary}>
                        {(selectedBranch?.branch_name || 'No Branch') + ', ' + (selectedBranch?.branch_address || 'No Address')}
                    </div>

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
                                <CloseIcon
                                    style={{ color: '#A7A7A7', marginRight: '10px', fontSize: '1rem' }}
                                    // className={styles.removeIcon} 
                                    onClick={() => handleRemoveProduct(product.product_id)}
                                />
                            </div>
                            <div
                                className={styles.productName}>
                                {product.name}
                                <br />
                                <p style={{ fontSize: '12px' }}>
                                    {product.SKU} - {product.size} - {product.color}
                                </p>
                            </div>
                            <div className={styles.productQuantityWrapper}>
                                <div className={styles.productQuantity}>
                                    <IndeterminateCheckBox
                                        // className={styles.quantityButton}
                                        onClick={() => handleQuantityChange(product.product_id, -1)}
                                        disabled={productQuantities[product.product_id] === 0}
                                    />

                                    <input
                                        type="number"
                                        className={styles.customInput}
                                        value={productQuantities[product.product_id] || 1}
                                        onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value) - (productQuantities[product.product_id] || 0))}

                                    />
                                    <AddBox
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
                {/* <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'Bank Transfer' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('Bank Transfer')}>
                    Bank Transfer
                </button> */}
            </div>

            <div className={styles.payRow}>
                <label>SubTotal Amount:</label>  {/*Total Amount in db Before Discount*/}
                <strong>{"₱ " + totalAmountBeforeDiscount.toFixed(2)}</strong>
            </div>

            <div className={styles.payRow}>
                <label>Discount (%):</label>
                <input
                    type="number"
                    className={styles.discountInput}
                    value={discountPercentage === 0 ? '' : discountPercentage}
                    onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                />
            </div>

            {/* {discountPercentage > 0 && (
                <div className={styles.payRow}>
                    <label>Discounted Amount:</label>
                    <strong>{"₱ " + discountedAmount.toFixed(2)}</strong>
                </div>
            )} */}
            <div className={styles.payRow}>
                <label>Total Amount:</label> {/*Discounted Amount in db */}
                <strong>{"₱ " + discountedAmount.toFixed(2)}</strong>
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

            {selectedPaymentMethod === 'E-Wallet' && (
                <div className={styles.tenderAmount}>
                    <div className={styles.payRow}>
                        <label>E-wallet Provider:</label>
                        <select
                            className={styles.selectWallet}
                            value={selectedEWalletProvider || 'G-Cash'}
                            onChange={handleEWalletProviderChange}
                        >
                            <option value="G-Cash">GCash</option>
                            <option value="Maya">Maya</option>
                        </select>

                    </div>
                    <div className={styles.payRow}>
                        <label>Tendered Amount:</label>
                        <input
                            type="number"
                            className={styles.tenderedInput}
                            value={tenderedAmount === 0 ? '' : tenderedAmount}
                            onChange={handleTenderedAmountChange}
                            readOnly

                        />

                    </div>
                    <div className={styles.payRow}>
                        <label>Referencce No.</label>
                        <input
                            className={styles.tenderedInput}
                            type="text"
                            value={referenceNumber}
                            onChange={handleReferenceNumberChange}
                        />

                    </div>
                    <div className={styles.payRow}>
                        <label>Change:</label>
                        <strong>{change.toFixed(2)}</strong>
                    </div>
                </div>
            )}

            {selectedPaymentMethod === 'Bank Transfer' && (
                <div className={styles.tenderAmount}>
                    <div className={styles.payRow}>
                        <label>Select Bank:</label>
                        <select className={styles.selectWallet}>
                            <option value="BPI">BPI</option>
                            {/* <option value="Maya">Maya</option> */}
                        </select>

                    </div>
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
                        <label>Referencce No.</label>
                        <input
                            type="text"
                            className={styles.tenderedInput}

                        />

                    </div>
                    <div className={styles.payRow}>
                        <label>Change:</label>
                        <strong>{change.toFixed(2)}</strong>
                    </div>
                </div>
            )}

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

                <button
                    onClick={handleOpenReturnModal}
                    className={styles.returnOrderButton}>
                    Return Order
                </button>
                <ReturnOrder
                    isOpen={isReturnModalOpen}
                    onClose={handleCloseReturnModal}
                />
            </div>

            <SuccessfulPrompt
                message="Order has been successfully placed!"
                isVisible={successOrderPrompt}
                onClose={() => setSuccessOrderPrompt(false)}
            />
        </div>
    );
};

export default OrderForm;
