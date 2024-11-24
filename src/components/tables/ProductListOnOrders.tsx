import React, { useMemo, useState } from 'react';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';
import styles from '@/components/styles/Table.module.css';
import { ProgressLoader } from '@/components/loading/Loading';

interface Product {
    id: number;
    name: string;
    price: number | null | string;
    stock?: number | null;
    SKU?: string;
    size?: string;
    color?: string;
    image_url?: string;
}

interface ProductListProps {
    products: Product[];
    onProductSelect: (product: Product) => void;
    isDisabled: boolean;
    onThumbnailClick: (imageUrl: string) => void;
    loading?: boolean;
}

const ProductList: React.FC<ProductListProps> = ({ products, onProductSelect, isDisabled, onThumbnailClick, loading = false}) => {
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
        key: 'name',
        direction: 'asc',
    });

    const columns = useMemo(
        () => [
            { Header: 'Image', accessor: 'image_url' as keyof Product, align: 'left', sortable: false },
            { Header: 'Product', accessor: 'name' as keyof Product, align: 'left', sortable: true },
            { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left', sortable: true },
            { Header: 'Size', accessor: 'size' as keyof Product, align: 'left', sortable: true },
            { Header: 'Color', accessor: 'color' as keyof Product, align: 'left', sortable: true },
            { Header: 'Stock', accessor: 'stock' as keyof Product, align: 'right', sortable: true },
            { Header: 'Price', accessor: 'price' as keyof Product, align: 'right', sortable: true },
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

    const handleSort = (key: keyof Product, sortable: boolean) => {
        if (!sortable) return;
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
                {/* <ArrowUpward
                    className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'asc' ? styles.active : ''}`}
                    style={{ fontSize: '16px' }}
                />
                <ArrowDownward
                    className={`${styles.sortIcon} ${isActive && sortConfig.direction === 'desc' ? styles.active : ''}`}
                    style={{ fontSize: '16px', marginLeft: '2px' }}
                /> */}
            </span>
        );
    };
    return (
        <div className={`${styles.container} ${isDisabled ? styles.disabledContainer : ''}`}>
            {loading && <ProgressLoader />}
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.accessor as string}
                                onClick={() => handleSort(column.accessor, column.sortable)}
                                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign} ${!column.sortable ? styles.notSortable : ''
                                    }`}
                            >
                                <div className={styles.sortableHeaderContent}>
                                    {column.Header}
                                    {column.sortable && sortConfig.key === column.accessor && (
                                        <span className={styles.sortIcon} style={{ fontSize: '16px', marginLeft: '2px' }}>
                                            {sortConfig.direction === 'asc' ? (
                                                <ArrowUpward fontSize="inherit" />
                                            ) : (
                                                <ArrowDownward fontSize="inherit" />
                                            )}
                                        </span>
                                    )}

                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {sortedProducts.map((product, index) => (
                        <tr
                            key={product.id ? product.id : `product-${index}`}
                            className={`${styles.tableRow} ${(!product.stock || product.stock <= 0) ? styles.disabledRow : ''
                                }`}
                            onClick={() => handleRowClick(product)}
                        >
                            <td className={styles.td}>
                                {product.image_url ? (
                                    <img
                                        src={product.image_url}
                                        alt={product.name}
                                        className={styles.thumbnail}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onThumbnailClick(product.image_url!);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ) : (
                                    <span>No Image</span>
                                )}
                            </td>
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
