import React, { useState, useMemo } from 'react';
import { formatDate } from '../../lib/dateTimeHelper';

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
        total_credits: number;
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
        <div
            style={{
                width: '58mm',
                fontFamily: 'monospace',
                fontSize: '12px',
                padding: '5px',
            }}
        >
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <img
                    src="/img/divine-jewel-logo.png"
                    alt="Divine Jewel Logo"
                    style={{ width: '50px', marginBottom: '5px' }}
                />
                <h2 style={{ margin: 0 }}>{returnItemsMetadata.branch_name}</h2>
                <p style={{ margin: 0, fontSize: '10px' }}>
                    {returnItemsMetadata.branch_address}
                </p>
                <h3 style={{ margin: '10px 0', fontSize: '14px' }}>
                    Return Items Receipt
                </h3>
            </div>
            <div>
                <p style={{ margin: '2px 0' }}>
                    <strong>Name:</strong> {returnItemsMetadata.customer_name}
                </p>
                <p style={{ margin: '2px 0' }}>
                    <strong>Credit ID:</strong> {returnItemsMetadata.credit_id}
                </p>
                <p style={{ margin: '2px 0' }}>
                    <strong>Date & Time:</strong> {currentTime}
                </p>
            </div>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    marginTop: '10px',
                }}
            >
                <thead>
                    <tr>
                        <th style={{ textAlign: 'left' }}>Item</th>
                        <th style={{ textAlign: 'right' }}>Qty.</th>
                        <th style={{ textAlign: 'right' }}>Returned</th>
                        <th style={{ textAlign: 'right' }}>Credits</th>
                    </tr>
                </thead>
                <tbody>
                    {returnItemsDatas.map((detail, index) => (
                        <tr key={index}>
                            <td style={{ textAlign: 'left' }}>
                                {detail.product_name}
                            </td>
                            <td style={{ textAlign: 'right' }}>{detail.quantity}</td>
                            <td style={{ textAlign: 'right' }}>
                                {detail.quantity_returned}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                                {(
                                    Number(detail.unit_price_deducted || 0) *
                                    Number(detail.quantity_returned || 0)
                                ).toFixed(2)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr style={{ margin: '10px 0' }} />
            <p style={{ textAlign: 'right', fontSize: '12px' }}>
                <strong>Total Credits: {totalAmount.toFixed(2)}</strong>
            </p>
            <p style={{ fontSize: '12px', margin: '5px 0' }}>
                <strong>Cashier:</strong> {returnItemsMetadata.employee_fullname}
            </p>
            <p
                style={{
                    textAlign: 'center',
                    fontSize: '10px',
                    margin: '5px 0',
                    lineHeight: '1.2',
                }}
            >
                Credits from this return can be used for your next purchase. <br />
                Please show this receipt to redeem applicable credits.
            </p>
            <p style={{ textAlign: 'center', fontSize: '12px', margin: '5px 0' }}>
                Thank you!
            </p>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <button
                    onClick={handlePrint}
                    style={{
                        display: 'none',
                        padding: '5px 10px',
                        fontSize: '12px',
                        backgroundColor: '#FCB6D7',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Print Receipt
                </button>
            </div>
        </div>
    );
};

export default Receipt;
