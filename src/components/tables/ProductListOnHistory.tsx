import React, { useMemo, useState } from 'react';
import styles from '../styles/Table.module.css';
import { ArrowUpward, ArrowDownward, InfoOutlined } from '@mui/icons-material';

interface Product {
  id: number;
  SKU: string;
  category_id: number;
  category_name: string;
  name: string;
  size: string;
  color: string;
  price: number;
  stock: number;
  quantity: number;
  is_archive: number | boolean;
  [key: string]: any;
  image_url?: string;
}

interface ProductListOnHistoryProps {
  products: Product[];
  onViewAction: (id: number) => void;
}

const ProductListOnHistory: React.FC<ProductListOnHistoryProps> = ({
  products,
  onViewAction,
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Image', accessor: 'image_url' as keyof Product, align: 'left', sortable: false },
      { Header: 'Product', accessor: 'name' as keyof Product, align: 'left' },
      { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left' },
      { Header: 'Category', accessor: 'category_name' as keyof Product, align: 'left' },
      { Header: 'Size', accessor: 'size' as keyof Product, align: 'left' },
      { Header: 'Color', accessor: 'color' as keyof Product, align: 'left' },
      { Header: 'Price', accessor: 'price' as keyof Product, align: 'right' },
      { Header: 'Stock', accessor: 'stock' as keyof Product, align: 'right' },
      { Header: 'Status', accessor : 'is_archive' as keyof Product, align: 'right' }
    ],
    []
  );

  // Handle sorting logic
  const sortedProducts = useMemo(() => {
    const sortedData = [...products];
    sortedData.sort((a, b) => {
      const valueA = a[sortConfig.key];
      const valueB = b[sortConfig.key];

      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1;
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sortedData;
  }, [products, sortConfig]);

  // Handle column header click for sorting
  const handleSort = (key: keyof Product) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: keyof Product) => {
    if (key === 'image_url') return null;
    const isActive = sortConfig.key === key;
    return (
      <span className={key === 'price' || key === 'stock' ? styles.sortIconsRight : styles.sortIconsLeft}>
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
            {columns.map(column => (
              <th
                key={column.accessor as string}
                onClick={() => handleSort(column.accessor)}
                className={`${styles.th} ${column.align === 'right' ? styles.thRightAlign : styles.thLeftAlign}`}
              >
                <div className={styles.sorthContent}>
                  {column.Header}
                  {renderSortIcon(column.accessor)}
                </div>
              </th>
            ))}
            <th className={styles.th}></th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map(product => (
            <tr key={product.id} className={styles.tableRow} onClick={() => onViewAction(product.id)}>
              <td className={styles.td}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className={styles.thumbnail}
                    onClick={(e) => {
                      e.stopPropagation();
                      // onThumbnailClick(product.image_url!);
                    }}
                    style={{ cursor: 'pointer' }}
                  />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}>{product.SKU}</td>
              <td className={styles.td}>{product.category_name}</td>
              <td className={styles.td}>{product.size}</td>
              <td className={styles.td}>{product.color}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>₱{product.price}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{product.stock}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{product.is_archive ? 'Inactive' : 'Active'}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}> 
              <InfoOutlined onClick={() => onViewAction(product.id)} style={{ cursor: 'pointer', fontSize: '20px' }} /> 
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductListOnHistory;
