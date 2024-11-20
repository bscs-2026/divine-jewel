import React, { useState } from 'react';
import { formatDate } from '../../lib/dateTimeHelper';
import styles from '@/components/styles/Modal.module.css';

interface OrderDetail {
  order_id: number;
  order_date: string;
  branch_name: string;
  branch_address: string;
  customer_name: string;
  employee_fullname: string;
  product_id: number;
  product_name: string;
  sku: string | null;
  product_size: string | null;
  product_color: string | null;
  quantity: number;
  unit_price: number | string;
  total_unit_price: number | string;
  mop: string;
  discount_percent: number;
  credit_id: number;
  total_amount: number;
  amount_tendered: number;
  amount_change: number;
  applied_credits: number;
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

  // Capture the current date and time once for the receipt
  const [currentTime] = useState(() => formatDate(new Date().toISOString(), 'Asia/Manila'));

  // Function to calculate total amount
  const calculateTotalAmount = (orderDetails: OrderDetail[]) => {
    return orderDetails.reduce((sum, detail) => sum + Number(detail.total_unit_price), 0);
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

  // Log applied credits to the console if they exist
  // if (orderMetadata.applied_credits && orderMetadata.applied_credits > 0) {
  // console.log("Applied Credits:", orderMetadata.applied_credits);
  // }

  return (
    <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
      <div className={styles.modalContentScrollable}>
        <div className={styles.header}>
          <img src="/img/divine-jewel-logo.png" alt="Divine Jewel Logo" className={styles.logo} />
        </div>
        <div className={styles.companyDetails}>
          <h2>{orderMetadata.branch_name}</h2>
          <h2>{orderMetadata.branch_address}</h2>
          <h1 className={styles.receiptHeader}>Sales Receipt</h1>
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.infoRow}>
            <div className={styles.label}>Name:</div>
            <div className={styles.value}>{orderMetadata.customer_name || 'N/A'}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>Receipt ID:</div>
            <div className={styles.value}>{orderMetadata.order_id}</div>
          </div>
          <div className={styles.infoRow}>
            <div className={styles.label}>Date & Time:</div>
            <div className={styles.value}>{currentTime}</div>
          </div>
        </div>
        <br />
        <table className={styles.receiptTable}>
          <thead>
            <tr>
              <th>Item</th>
              <th className={styles.priceHeader}>Qty.</th>
              <th className={styles.priceHeader}>Price</th>
              <th className={styles.priceHeader}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.map((detail, index) => (
              <tr key={index}>
                <td className={styles.itemDescription}>
                  {detail.product_name}
                  <br />
                  <span className={styles.itemDetails}>
                    {detail.product_id}&emsp;{detail.product_size}&emsp;{detail.product_color}
                  </span>
                </td>
                <td>{detail.quantity}</td>
                <td>{Number(detail.unit_price).toFixed(2)}</td>
                <td>{Number(detail.total_unit_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className={styles.receiptSummary}>
          <p><span>Subtotal:</span> {totalAmount.toFixed(2)}</p>

          {/* Display discount if applicable */}
          {orderMetadata.discount_percent > 0 && (
            <>
              <p><span>Discount ({orderMetadata.discount_percent}% off):</span> -{discountAmount}</p>
            </>
          )}

          {/* Display applied credits if applicable */}
          {Number(orderMetadata.applied_credits || 0) > 0 && (
            <p><span>Credits (ID: {orderMetadata.credit_id}):</span> -{Number(orderMetadata.applied_credits).toFixed(2)}</p>
          )}


          <br />
          <p><strong>Total:</strong> <strong>{Number(orderMetadata.total_amount).toFixed(2)}</strong></p>

          {/* Display reference number if payment method is e-wallet */}
          {orderMetadata.mop && orderMetadata.mop.toLowerCase() === 'e-wallet' && (
            <p><span>Reference Number:</span> {orderMetadata.reference_number || 'N/A'}</p>
          )}

          <br />
          <p><span>Tendered Amount ({orderMetadata.mop === 'E-Wallet' ? (orderMetadata.e_wallet_provider || 'N/A') : orderMetadata.mop}):</span> {orderMetadata.amount_tendered}</p>
          <p><span>Change:</span> {orderMetadata.amount_change}</p>
        </div>

        <br /><br />
        <p className={styles.cashierInfo}>Cashier: {orderMetadata.employee_fullname}</p>
        <br />
        <p className={styles.receiptOfficial}>This serves as an official receipt</p>
        <p className={styles.receiptNotice}>Return/Exchange within three (3) days with receipt.</p>
        <br />
        <h2 className={styles.receiptSubHeading}>Thank you for your purchase!</h2>
        <br />
        <div className={styles.printButtonContainer}>
          <button onClick={handlePrint} className={styles.printButton}>Print Receipt</button>
        </div>
        <br />
      </div>
    </div>
  );
};

export default Receipt;
