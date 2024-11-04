import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '../styles/Table.module.css';

interface Product {
    id: number;
    name: string;
    price: number | null | string;
    stock?: number | null;
    SKU?: string;
    size?: string;
    color?: string;
}

interface ProductListProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
    isDisabled: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect, isDisabled }) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc',
    });

    const columns = useMemo(
        () => [
            { Header: 'Product', accessor: 'name' as keyof Product, align: 'left' },
            { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left' },
            { Header: 'Size', accessor: 'size' as keyof Product, align: 'left' },
            { Header: 'Color', accessor: 'color' as keyof Product, align: 'left' },
            { Header: 'Stock', accessor: 'stock' as keyof Product, align: 'right' },
            { Header: 'Price', accessor: 'price' as keyof Product, align: 'right' },
        ],
        []
    );

    const sortedProducts = useMemo(() => {
        const sortedData = [...products];
        sortedData.sort((a, b) => {
            const valueA = a[sortConfig.key];
            const valueB = b[sortConfig.key];

            if (valueA == null) return sortConfig.direction === 'asc' ? 1 : -1;
            if (valueB == null) return sortConfig.direction === 'asc' ? -1 : 1;

            if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
            if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortedData;
    }, [products, sortConfig]);

    const handleSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleRowClick = (product: Product) => {
        if (!isDisabled && product.stock && product.stock > 0) {
            onProductSelect(product);
        }
    };

    const renderSortIcon = (key: keyof Product) => {
        const isActive = sortConfig.key === key;
        return (
            <span className={key === 'stock' || key === 'price' ? styles.sortIconsRight : styles.sortIconsLeft} >
                {/* <ArrowUpward className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`} />
                <ArrowDownward className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}  /> */}
            </span>
        );
    };

    return (
        <div className={`${styles.container} ${isDisabled ? styles.disabledContainer : ''}`}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor as string}
                                onClick={() => handleSort(column.accessor)}
                                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
                            >
                                <div className={styles.sortableHeaderContent}>
                                    {column.Header}
                                    {renderSortIcon(column.accessor)}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.map((product, index) => (
                        <tr
                            key={product.id ? product.id : `product-${index}`}
                            className={`${styles.tableRow} ${(!product.stock || product.stock <= 0) ? styles.disabledRow : ''}`}
                            onClick={() => handleRowClick(product)}
                        >
                            <td className={styles.tdProductName}>{product.name}</td>
                            <td className={styles.td}>{product.SKU || 'N/A'}</td>
                            <td className={styles.td}>{product.size || 'N/A'}</td>
                            <td className={styles.td}>{product.color || 'N/A'}</td>
                            <td className={styles.tdStock}>
                                {product.stock !== null ? (product.stock > 0 ? product.stock : 0) : ''}
                            </td>
                            <td className={`${styles.td} ${styles.rightAlign}`}>
                                {product.price !== null ? `${parseFloat(product.price as string).toFixed(2)}` : ''}
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>
        </div>
    );
};

export default ProductList;
