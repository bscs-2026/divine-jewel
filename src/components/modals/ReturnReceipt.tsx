import React, { useState, useMemo } from 'react';
import { formatDate } from '../../lib/dateTimeHelper';
import styles from '@/components/styles/Modal.module.css';

interface returnItemsData {
    product_id: number;
    product_name: string;
    product_size: string | null;
    product_color: string | null;
    quantity: number;
    quantity_returned: number;
    unit_price: number | string;
    discount_percent: number;
    unit_price_deducted: number | string;
}

interface ReceiptProps {
    returnItemsDatas: returnItemsData[];
    returnItemsMetadata: {
        credit_id: number;
        customer_name: string;
        branch_name: string;
        branch_address: string;
        employee_fullname: string;
    };
}

const Receipt: React.FC<ReceiptProps> = ({
    returnItemsDatas,
    returnItemsMetadata,
}) => {
    const [currentTime] = useState(() =>
        formatDate(new Date().toISOString(), 'Asia/Manila')
    );

    const handlePrint = () => {
        window.print();
    };

    // Calculate total credits for returned items
    const totalAmount = useMemo(
        () =>
            returnItemsDatas.reduce(
                (total, item) =>
                    total +
                    (Number(item.unit_price_deducted || 0) *
                        Number(item.quantity_returned || 0)),
                0
            ),
        [returnItemsDatas]
    );

    return (
        <div className={`${styles.modalContent} ${styles.modalContentMedium}`}>
            <div className={styles.modalContentScrollable}>
                <div className={styles.header}>
                    <img
                        src="/img/divine-jewel-logo.png"
                        alt="Divine Jewel Logo"
                        className={styles.logo}
                    />
                </div>
                <div className={styles.companyDetails}>
                    <h2>{returnItemsMetadata.branch_name}</h2>
                    <h2>{returnItemsMetadata.branch_address}</h2>
                    <h1 className={styles.receiptHeader}>Return Items Receipt</h1>
                </div>
                <div className={styles.infoContainer}>
                    <div className={styles.infoRow}>
                        <div className={styles.label}>Name:</div>
                        <div className={styles.value}>
                            {returnItemsMetadata.customer_name}
                        </div>
                    </div>
                    <div className={styles.infoRow}>
                        <div className={styles.label}>Credit ID:</div>
                        <div className={styles.value}>
                            {returnItemsMetadata.credit_id}
                        </div>
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
                            <th className={styles.priceHeader}>Unit Price</th>
                            <th className={styles.priceHeader}>Disc. %</th>
                            <th className={styles.priceHeader}>Returned Qty.</th>
                            <th className={styles.priceHeader}>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returnItemsDatas.length > 0 ? (
                            returnItemsDatas.map((detail, index) => {
                                const paidAmount =
                                    Number(detail.unit_price_deducted || 0) *
                                    Number(detail.quantity_returned || 0);
                                return (
                                    <tr key={index}>
                                        <td className={styles.itemDescription}>
                                            {detail.product_name}
                                            <br />
                                            <span className={styles.itemDetails}>
                                                {detail.product_id}&emsp;
                                                {detail.product_size || 'N/A'}
                                                &emsp;
                                                {detail.product_color || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{detail.quantity}</td>
                                        <td>{Number(detail.unit_price).toFixed(2)}</td>
                                        <td>{detail.discount_percent}</td>
                                        <td>{detail.quantity_returned}</td>
                                        <td>{paidAmount.toFixed(2)}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan={5} className={styles.noData}>
                                    No items to display.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className={styles.receiptSummary}>
                    <p>
                        <span>Total Credits:</span> {totalAmount.toFixed(2)}
                    </p>
                </div>

                <br />
                <p className={styles.cashierInfo}>
                    Cashier: {returnItemsMetadata.employee_fullname}
                </p>
                <br />
                <p className={styles.receiptNotice}>
                    Credits from this return can be used for your next purchase. <br />
                    Please show this receipt during your next visit to redeem applicable credits.
                </p>
                <br />
                <h2 className={styles.receiptSubHeading}>
                    Thank you! We look forward to serving you again.
                </h2>
                <br />
                <div className={`${styles.printButtonContainer} printButtonContainer`}>
                    <button onClick={handlePrint} className={styles.printButton}>
                        Print Receipt
                    </button>
                </div>
                <br />
            </div>
        </div>
    );
};

export default Receipt;
