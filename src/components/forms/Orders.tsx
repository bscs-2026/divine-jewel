import React, { useState, useEffect, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { AddBox, IndeterminateCheckBox, ArrowDropUp, ArrowDropDown, Add } from '@mui/icons-material';
import styles from '@/components/styles/Form.module.css';
import { SuccessfulPrompt } from "@/components/prompts/Prompt";
import { formatDate } from '@/lib/dateTimeHelper';
import Spinner from '@/components/loading/Loading';
import Modal from '@/components/modals/Modal';
import Receipt from '@/components/modals/OrderReceipt';
import { getCookieValue } from '@/lib/clientCookieHelper';

const OrderForm = ({ selectedProducts, setSelectedProducts, selectedBranch, reloadData }) => {
    const [employeeName, setEmployeeName] = useState('Unknown Cashier');
    const [employeeId, setEmployeeId] = useState(null);
    const [productQuantities, setProductQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = product.quantity || 0;
            return acc;
        }, {})
    );

    // Retrieve cookie data
    useEffect(() => {
        const firstName = getCookieValue('first_name');
        const lastName = getCookieValue('last_name');
        const userId = getCookieValue('user_id');

        if (firstName && lastName) {
            setEmployeeName(`${firstName} ${lastName}`);
        } else {
            setEmployeeName('N/A');
        }

        if (userId) {
            setEmployeeId(userId);
        }
    }, []);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('Cash');
    const [tenderedAmount, setTenderedAmount] = useState('');
    const [selectedEWalletProvider, setSelectedEWalletProvider] = useState('G-Cash'); // Set default to 'G-Cash'
    const [referenceNumber, setReferenceNumber] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successOrderPrompt, setSuccessOrderPrompt] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<string>('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [orderDetails, setOrderDetails] = useState<OrderDetail[]>([]);
    const [orderMetadata, setOrderMetadata] = useState<OrderDetail | null>(null);
    const [showReceipt, setShowReceipt] = useState(false);
    const [customerCredits, setCustomerCredits] = useState(0);
    const [appliedCredits, setAppliedCredits] = useState(0);
    const [applyOption, setApplyOption] = useState("");
    const [creditId, setCreditId] = useState('');
    const [creditError, setCreditError] = useState('');
    const [loading, setLoading] = useState<boolean>(false);

    interface OrderDetail {
        order_id: number;
        order_date: string;
        branch_name: string;
        branch_address: string;
        customer_name: string;
        employee_fullname: string;
        product_name: string;
        sku: string | null;
        product_size: string | null;
        product_color: string | null;
        quantity: number;
        price: number | string;
        total_price: number | string;
        mop: string;
        discount_percent: number;
        total_amount: number;
        applied_credits: number;
        credit_id: number;
        amount_tendered: number;
        amount_change: number;
        e_wallet_provider: string | null;
        reference_number: string | null;
    }

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const options = {
                timeZone: 'Asia/Manila',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
            };
            const formattedTime = new Intl.DateTimeFormat('en-US', options).format(now);
            setCurrentTime(formattedTime);
        };

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const resetForm = () => {
        setSelectedProducts([]);
        setProductQuantities({});
        setSelectedPaymentMethod('Cash');
        setTenderedAmount('');
        setSelectedEWalletProvider('G-Cash');
        setReferenceNumber('');
        setCustomerName('');
        setDiscountPercentage(0);
        setTotalAmount(0);
        setOrderDetails([]);
        setOrderMetadata(null);
        setCustomerCredits(0);
        setAppliedCredits(0);
        setApplyOption("");
        setCreditId('');
        setCreditError('');
        setShowReceipt(false);
    };

    useEffect(() => {
        if (successOrderPrompt) {
            const timer = setTimeout(() => {
                setSuccessOrderPrompt(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [successOrderPrompt]);


    const subTotalAmount = useMemo(() => {
        return selectedProducts.reduce((total, product) => {
            const quantity = productQuantities[product.product_id] || 1;
            return total + (parseFloat(product.price) * quantity || 0);
        }, 0);
    }, [selectedProducts, productQuantities]);

    useEffect(() => {
        let finalAmount = subTotalAmount;

        if (applyOption === "Discount") {
            const discount = (subTotalAmount * discountPercentage) / 100;
            finalAmount -= discount;
            setAppliedCredits(0);
            setTenderedAmount('');
        } else if (applyOption === "Credits") {
            finalAmount -= appliedCredits;
            setDiscountPercentage(0);
            setTenderedAmount('');
        }

        setTotalAmount(finalAmount !== null && !isNaN(finalAmount) ? finalAmount : 0);
    }, [subTotalAmount, discountPercentage, applyOption, appliedCredits, customerCredits]);

    const handleQuantityChange = (productId, delta) => {
        setProductQuantities((prevQuantities) => {

            const product = selectedProducts.find(p => p.product_id === productId);
            const availableStock = product ? product.stock : 0; // Ensure the product has stock information
    
            // Ensure the new quantity doesn't exceed the available stock
            const newQuantity = Math.max(0, Math.min((prevQuantities[productId] || 1) + delta, availableStock));
            return { ...prevQuantities, [productId]: newQuantity };

            // const newQuantity = Math.max(0, (prevQuantities[productId] || 1) + delta);
            // return { ...prevQuantities, [productId]: newQuantity };
            
        });
    };

    const handleRemoveProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.product_id !== productId);
        setSelectedProducts(updatedProducts);
    };

    const handleTenderedAmountChange = (event) => {
        setTenderedAmount(parseFloat(event.target.value) || '');
    };
    const handleEWalletProviderChange = (event) => {
        setSelectedEWalletProvider(event.target.value);
    };
    const handleReferenceNumberChange = (event) => {
        setReferenceNumber(event.target.value);
    };

    // Apply credits or discount based on selection
    useEffect(() => {
        let finalAmount = subTotalAmount;
        const discountAmount = (subTotalAmount * discountPercentage) / 100;
        finalAmount -= discountAmount;

        if (applyOption === "Credits") {
            const creditsToApply = Math.min(customerCredits, finalAmount);
            setAppliedCredits(creditsToApply);
            finalAmount -= creditsToApply;
        } else {
            setAppliedCredits(0);
        }

        setTotalAmount(finalAmount);
    }, [subTotalAmount, discountPercentage, applyOption, customerCredits]);

    const handleApplyOptionChange = (option) => {
        if (applyOption === option) {
            // Toggling the currently active option off, so reset relevant fields
            setApplyOption('');

            if (option === "Discount") {
                setDiscountPercentage(0);
                // setTotalAmount(subTotalAmount);
            } else if (option === "Credits") {
                setCreditId('');
                setAppliedCredits(0);
                setCreditError('');
                setCustomerCredits(0);
            }
        } else {
            // Switching to a new option, so clear all values for both options
            setApplyOption(option);

            // Reset values for both Discount and Credits
            setDiscountPercentage(0);
            setTotalAmount(subTotalAmount);
            setCreditId('');
            setAppliedCredits(0);
            setCreditError('');
            setCustomerCredits(0);
        }
    };

    // Handle change of credit ID, fetch credits, and set applied credits
    const handleCreditIdChange = async (event) => {
        const id = event.target.value;
        setCreditId(id);

        if (id) {
            try {
                const response = await fetch(`/api/credits/${id}`);
                const data = await response.json();

                if (response.ok && data.status === 'active') {
                    setCustomerCredits(parseFloat(data.credit_amount));
                    const creditsToApply = Math.min(parseFloat(data.credit_amount), subTotalAmount);
                    setAppliedCredits(creditsToApply);

                    setCreditError('');
                } else {
                    setCreditError("Invalid or inactive Credit ID.");
                    setCustomerCredits(0);
                    setAppliedCredits(0);
                }
            } catch (error) {
                console.error("Error fetching credit amount:", error);
                setCreditError("Unable to fetch credit information.");
                setCustomerCredits(0);
                setAppliedCredits(0);
            }
        } else {
            setCreditError('');
            setCustomerCredits(0);
            setAppliedCredits(0);
        }
    };

    const handlePaymentMethodChange = (method) => {
        setSelectedPaymentMethod(method);
        if (method === 'E-Wallet') {
            if (discountPercentage > 0) {
                setTenderedAmount(totalAmount);
            } else {
                setTenderedAmount(subTotalAmount);
            }
        } else {
            setTenderedAmount('');
        }
    };

    const handleDiscountChange = (event) => {
        let value = parseFloat(event.target.value) || 0;
    
        // Ensure the value is within the range of 0 to 100
        if (value < 0) {
            value = 0;
        } else if (value > 100) {
            value = 100;
        }
    
        setDiscountPercentage(value);
    };


    const handlePlaceOrder = async () => {
        setIsLoading(true);
        const change = tenderedAmount > totalAmount ? tenderedAmount - totalAmount : 0;

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
            employee_id: employeeId || null,
            branch_code: selectedBranch ? selectedBranch.branch_code : null,
            subtotal_amount: subTotalAmount,
            discount_percentage: discountPercentage || null,
            total_amount: totalAmount !== null && !isNaN(totalAmount) ? totalAmount : 0,
            applied_credits: applyOption === "Credits" ? appliedCredits : 0,
            order_items: orderItems,
            payment_method: selectedPaymentMethod,
            tendered_amount: tenderedAmount,
            change: selectedPaymentMethod === 'Cash' ? change : null,
            reference_number: selectedPaymentMethod !== 'Cash' ? referenceNumber : null,
            e_wallet_provider: selectedPaymentMethod === 'E-Wallet' ? selectedEWalletProvider : null,
            ...(applyOption === "Credits" && { credit_id: creditId })
        };

        try {
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderPayload),
            });

            const data = await response.json();
            console.log('Server response:', data);

            if (response.ok) {
                setSuccessOrderPrompt(true);
                const order_id = data.order_id;
                fetchOrderDetails(order_id);
                reloadData();
            } else {
                console.error('Failed to place order:', data.error);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOrderDetails = async (order_id) => {
        setShowReceipt(true);
        try {
            const response = await fetch(`/api/history/${order_id}/orderDetails`);
            const data = await response.json();
            setOrderDetails(data.orderDetails);
            if (data.orderDetails.length > 0) {
                setOrderMetadata(data.orderDetails[0]);
            }
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    const change = tenderedAmount > totalAmount ? tenderedAmount - totalAmount : 0;

    const [isPlaceOrderDisabled, setIsPlaceOrderDisabled] = useState(true);

    // Validation Logic for Button
    useEffect(() => {
        const isOrderValid = () => {
            // Check if there are items in the order
            if (!selectedProducts || selectedProducts.length === 0) return false;

            // Check payment validity
            if (selectedPaymentMethod === 'Cash') {
                return tenderedAmount >= totalAmount;
            }
            if (selectedPaymentMethod === 'E-Wallet') {
                return !!referenceNumber && !!selectedEWalletProvider && totalAmount > 0; 
            }
            if (selectedPaymentMethod === 'Credits') {
                return appliedCredits >= totalAmount && totalAmount > 0;
            }

            return false;
        };
        setIsPlaceOrderDisabled(!isOrderValid());
    }, [selectedProducts, selectedPaymentMethod, tenderedAmount, totalAmount, referenceNumber, selectedEWalletProvider, appliedCredits]);



    const handleNewOrder = () => {
        resetForm();
    };

    return (
        <div className={styles.container}>
            {loading && <Spinner />}
            {/* Order and Customer Details */}
            <div className={styles.orderDetails}>
                <div className={styles.headerContainer}>
                    <div className={styles.headerLeft}>
                        <div className={styles.heading2}>Current Order</div>
                    </div>
                    <div className={styles.primary}>Cashier: {employeeName}</div>
                    <div className={styles.primary}>Date & Time: {new Date().toLocaleDateString()} {currentTime}</div>
                    <div className={styles.primary}>
                        {(selectedBranch?.branch_name || 'No Branch') + ', ' + (selectedBranch?.branch_address || 'No Address')}
                    </div>
                </div>
                <div className={styles.horizontalLine}></div>

                {/* Customer Name and Current Order */}
                <div className={styles.orderCustomerContainer}>
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
                                    className={styles.closeIcon}
                                    onClick={() => handleRemoveProduct(product.product_id)}
                                />
                            </div>
                            <div className={styles.productName}>
                                {product.name}
                                <br />
                                <p style={{ fontSize: '12px' }}>
                                    {product.SKU} - {product.size} - {product.color}
                                </p>
                            </div>
                            <div className={styles.productQuantityWrapper}>
                                <div className={styles.productQuantity}>
                                    <IndeterminateCheckBox
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
            <div className={styles.paymentContainer}>
                <div className={styles.paymentMethods}>
                    <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'Cash' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('Cash')}>
                        Cash
                    </button>
                    <button className={`${styles.paymentButton} ${selectedPaymentMethod === 'E-Wallet' ? styles.activePaymentButton : ''}`} onClick={() => handlePaymentMethodChange('E-Wallet')}>
                        E-Wallet
                    </button>
                </div>

                <div className={styles.paymentRebates}>
                    <button className={`${styles.paymentButton} ${applyOption === 'Discount' ? styles.activePaymentButton : ''}`} onClick={() => handleApplyOptionChange("Discount")}>
                        Discount
                    </button>
                    <button className={`${styles.paymentButton} ${applyOption === 'Credits' ? styles.activePaymentButton : ''}`} onClick={() => handleApplyOptionChange("Credits")}>
                        Credits
                    </button>
                </div>
            </div>


            {/* Conditional Field Rendering */}
            {applyOption === "Discount" && (
                <div className={styles.payRow}>
                    <label>Discount (%):</label>
                    <input
                        type="number"
                        className={styles.discountInput}
                        value={discountPercentage === 0 ? '' : discountPercentage}
                        onChange={(e) => handleDiscountChange(e)}
                        placeholder="0"
                    />
                </div>
            )}
            {applyOption === "Credits" && (
                <>
                    <div className={styles.payRow}>
                        <label>Credit ID:</label>
                        {creditError && (
                            <div className={styles.errorTextCreditID}>
                                {creditError}
                            </div>
                        )}
                        <input
                            type="text"
                            className={styles.creditIdInput}
                            value={creditId}
                            onChange={handleCreditIdChange}
                            placeholder="12345678"
                        />
                    </div>

                    {creditId && customerCredits > 0 && !creditError && (
                        <div className={styles.payRow}>
                            <label>Credit Balance:</label>
                            <strong>{customerCredits.toFixed(2)}</strong>
                        </div>
                    )}
                </>
            )}

            < br />

            {/* Subtotal and Total Calculation */}
            <div className={styles.payRow}>
                <label>Subtotal:</label>
                <strong>{subTotalAmount.toFixed(2)}</strong>
            </div>

            {appliedCredits > 0 && (
                <div className={styles.payRow}>
                    <label>Credits Applied (ID: {creditId}):</label>
                    <strong>- {appliedCredits.toFixed(2)}</strong>
                </div>
            )}

            {discountPercentage > 0 && (
                <div className={styles.payRow}>
                    <label>Discount Applied:</label>
                    <strong>
                        - {(typeof subTotalAmount === 'number' && typeof totalAmount === 'number' && !isNaN(subTotalAmount - totalAmount))
                            ? (subTotalAmount - totalAmount).toFixed(2)
                            : '0.00'}
                    </strong>
                </div>
            )}

            <br />

            <div className={styles.payRow}>
                <label>Total:</label>
                <strong>{"₱ " + totalAmount.toFixed(2)}</strong>
            </div>

            {/* Tendered Amount and Change Section */}
            {selectedPaymentMethod === 'Cash' && (
                <div className={styles.tenderAmount}>
                    <div className={styles.payRow}>
                        <label>Tender Amount:</label>
                        <input
                            type="number"
                            className={styles.tenderedInput}
                            value={
                                tenderedAmount !== 0 ? tenderedAmount : '0'
                            }
                            onChange={handleTenderedAmountChange}
                            min="0"
                            placeholder='0'
                        />
                    </div>

                    <div className={styles.payRow}>
                        <label>Change:</label>
                        <strong>{change.toFixed(2)}</strong>
                    </div>
                </div>
            )}

            {/* E-Wallet Details */}
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
                        <label>Tender Amount:</label>
                        <input
                            type="number"
                            className={styles.tenderedInput}
                            value={
                                tenderedAmount !== 0 ? tenderedAmount : '0'
                            }
                            onChange={handleTenderedAmountChange}
                            min="0"
                            placeholder="0"
                        />
                    </div>
                    <div className={styles.payRow}>
                        <label>Reference No.</label>
                        <input
                            className={styles.tenderedInput}
                            type="number"
                            value={referenceNumber}
                            onChange={handleReferenceNumberChange}
                            placeholder="12345678"
                        />
                    </div>
                    <div className={styles.payRow}>
                        <label>Change:</label>
                        <strong>{change.toFixed(2)}</strong>
                    </div>
                </div>
            )}

            {/* Place Order and New Order Buttons */}
            <div className={styles.buttonsContainer}>
                <button onClick={handleNewOrder} className={styles.newOrderButton}>
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

            {/* Success Prompt */}
            <SuccessfulPrompt
                message="Order has been successfully placed!"
                isVisible={successOrderPrompt}
                onClose={() => setSuccessOrderPrompt(false)}
            />

            {/* Receipt Modal */}
            {showReceipt && (
                <Modal show={showReceipt} onClose={() => { setShowReceipt(false); resetForm(); }}>
                    {orderMetadata && <Receipt orderDetails={orderDetails} orderMetadata={orderMetadata} />}
                </Modal>
            )}
        </div>
    );

};

export default OrderForm;
