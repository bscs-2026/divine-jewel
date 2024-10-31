//src/components/receipt/receipt.tsx
import React from 'react';
import styles from '@/components/styles/Modal.module.css';

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
  discounted_amount: number;
  amount_tendered: number;
  amount_change: number;
  e_wallet_provider: string | null;
  reference_number: string | null;
}

interface ReceiptProps {
  orderDetails: OrderDetail[];
  orderMetadata: OrderDetail;
}

const Receipt: React.FC<ReceiptProps> = ({
  orderDetails,
  orderMetadata,
}) => {

  // Function to calculate total amount
  const calculateTotalAmount = (orderDetails: OrderDetail[]) => {
    return orderDetails.reduce((sum, detail) => sum + Number(detail.total_price), 0);
  };

  // Function to calculate discount in pesos
  const calculateDiscountInPesos = (totalAmount: number, discountPercent: number) => {
    return (totalAmount * (discountPercent / 100)).toFixed(2);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalAmount = calculateTotalAmount(orderDetails);
  const discountAmount = calculateDiscountInPesos(totalAmount, orderMetadata.discount_percent);

  return (
    <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
      <div className={styles.modalContentScrollable}>
        <h2 className={styles.receiptSubHeading}>Divine Jewel</h2>
        <div className={styles.companyDetails}>
          <h2>{orderMetadata.branch_name}</h2>
          <h2>{orderMetadata.branch_address}</h2>
        </div>
        <br />
        <p><strong>Order ID:</strong> {orderMetadata.order_id}</p>
        <p><strong>Date and Time: </strong>{new Date(orderMetadata.order_date).toLocaleString('en-US', { timeZone: 'Asia/Manila' })}</p>
        <p><strong>Employee Name:</strong> {orderMetadata.employee_fullname}</p>
        <p><strong>Customer Name:</strong> {orderMetadata.customer_name || 'N/A'}</p>
        <table className={styles.receiptTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail, index) => (
              <tr key={index}>
                <td className={styles.itemDescription}>{detail.sku} - {detail.product_name} - {detail.product_size}, {detail.product_color}</td>
                <td>{detail.quantity}</td>
                <td>{Number(detail.price).toFixed(2)}</td>
                <td>{Number(detail.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.receiptSummary}>
          <p><strong>Sub Total:</strong> {totalAmount.toFixed(2)}</p>
          <p><strong>Discount ({orderMetadata.discount_percent}% off):</strong> -{discountAmount}</p>
          <br />
          <p><strong>Total:</strong> {orderMetadata.discounted_amount}</p>
          <p><strong>MOP:</strong> {orderMetadata.mop === 'E-Wallet' ? (orderMetadata.e_wallet_provider || 'N/A') : orderMetadata.mop}</p>
          {orderMetadata.mop && orderMetadata.mop.toLowerCase() === 'e-wallet' && (
            <p><strong>Reference Number:</strong> {orderMetadata.reference_number || 'N/A'}</p>
          )}
          <p><strong>Amount Tendered:</strong> {orderMetadata.amount_tendered}</p>
          <p><strong>Change:</strong> {orderMetadata.amount_change}</p>
        </div>
        <br />
        <h2 className={styles.receiptSubHeading}>Thank You!</h2>
        <br />
        <div className={styles.printButtonContainer}>
          <button onClick={handlePrint} className={styles.printButton}>Print Receipt</button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
