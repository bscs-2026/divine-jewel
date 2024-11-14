import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward, InfoOutlined } from '@mui/icons-material';
import styles from '../styles/Table.module.css';

interface Order {
    order_id: number;
    date: string;
    employee_name: string;
    branch_name: string;
    subtotal_amount: string;
    discount_pct: string;
    applied_credits: string;
    total_amount: string;
}

interface OrdersTableProps {
    orders: Order[];
    onViewAction: (order_id: number) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onViewAction }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Order; direction: 'asc' | 'desc' }>({
        key: 'date',
        direction: 'desc',
    });

    const columns = useMemo(
        () => [
            { Header: 'Order ID', accessor: 'order_id' as keyof Order, align: 'left' },
            { Header: 'Date', accessor: 'date' as keyof Order, align: 'left' },
            { Header: 'Employee', accessor: 'employee_name' as keyof Order, align: 'left' },
            { Header: 'Branch', accessor: 'branch_name' as keyof Order, align: 'left' },
            { Header: 'Subtotal', accessor: 'subtotal_amount' as keyof Order, align: 'right' },
            { Header: 'Total', accessor: 'total_amount' as keyof Order, align: 'right' },
            { Header: '', accessor: 'order_id' as keyof Order, align: 'center' },
        ],
        []
    );

    const sortedOrders = useMemo(() => {
        const sortedData = [...orders];
        sortedData.sort((a, b) => {
            const valueA = a[sortConfig.key] ?? '';
            const valueB = b[sortConfig.key] ?? '';
            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortedData;
    }, [orders, sortConfig]);

    const handleSort = (key: keyof Order) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key: keyof Order) => {
        const isActive = sortConfig.key === key;
        return (
            <span className={styles.sortIcons}>
                <ArrowUpward
                    className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`}
                    style={{ fontSize: '16px' }}
                />
                <ArrowDownward
                    className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}
                    style={{ fontSize: '16px', marginLeft: '2px' }}
                />
            </span>
        );
    };

    return (
        <div className={styles.container}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column, colIndex) => (
                            <th
                                key={`column-${colIndex}`}
                                onClick={() => column.accessor !== 'order_id' && handleSort(column.accessor)}
                                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
                            >
                                <div className={styles.sortContent}>
                                    {column.Header}
                                    {column.accessor !== 'order_id' && renderSortIcon(column.accessor)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedOrders.map((order, index) => (
                        <tr
                            key={`order-row-${order.order_id}-${index}`}
                            className={styles.tableRow}
                            onClick={() => onViewAction(order.order_id)}
                        >
                            <td className={styles.td}>{order.order_id}</td>
                            <td className={styles.td}>
                                {new Date(order.date).toLocaleDateString()}  {new Date(order.date).toLocaleTimeString()}
                            </td>
                            <td className={styles.td}>{order.employee_name}</td>
                            <td className={styles.td}>{order.branch_name}</td>
                            
                            <td className={`${styles.td} ${styles.rightAlign}`}>₱{order.subtotal_amount}</td>
                            <td className={`${styles.td} ${styles.rightAlign}`}>₱{order.total_amount}</td>
                            <td className={styles.td} style={{ textAlign: 'center' }}>
                                <InfoOutlined className={styles.viewButton} onClick={() => onViewAction(order.order_id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersTable;
