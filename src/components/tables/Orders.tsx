import React from 'react';

interface OrderDetail {
    product_id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
}

interface Order {
    id: number;
    date: string;
    customer_id: number;
    employee_id: number;
    branch_code: number;
    total_amount: number;
    status: string;
    order_details: OrderDetail[];
}

interface OrderTableProps {
    orders: Order[];
}

const OrderTable: React.FC<OrderTableProps> = ({ orders }) => {
    return (
        <div className="order-table-container">
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Date</th>
                        <th>Customer ID</th>
                        <th>Employee ID</th>
                        <th>Branch Code</th>
                        <th>Total Amount</th>
                        <th>Status</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <React.Fragment key={order.id}>
                            <tr>
                                <td>{order.id}</td>
                                <td>{order.date}</td>
                                <td>{order.customer_id}</td>
                                <td>{order.employee_id}</td>
                                <td>{order.branch_code}</td>
                                <td>{order.total_amount.toFixed(2)}</td>
                                <td>{order.status}</td>
                                <td>
                                    {order.order_details.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => toggleDetails(order.id)}
                                        >
                                            View Details
                                        </button>
                                    )}
                                </td>
                            </tr>

                            {/* Details Row */}
                            {order.order_details.map((detail, index) => (
                                <tr key={index} className="order-details-row">
                                    <td colSpan={8} className="order-details">
                                        <div>
                                            <strong>Product ID:</strong> {detail.product_id}
                                        </div>
                                        <div>
                                            <strong>Product Name:</strong> {detail.product_name || 'Unknown'}
                                        </div>
                                        <div>
                                            <strong>Quantity:</strong> {detail.quantity}
                                        </div>
                                        <div>
                                            <strong>Unit Price:</strong> ${detail.unit_price.toFixed(2)}
                                        </div>
                                        <div>
                                            <strong>Total Price:</strong> ${(detail.quantity * detail.unit_price).toFixed(2)}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderTable;
