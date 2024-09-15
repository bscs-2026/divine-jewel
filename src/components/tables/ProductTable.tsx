import React, { useMemo, useState, useEffect } from 'react';
import styles from '../styles/Table.module.css';
import styles2 from '../styles/Button.module.css';
import { ArrowUpward, ArrowDownward } from '@mui/icons-material';

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  quantity: number;
  is_archive: number | boolean;
  [key: string]: any;
}

interface ProductTableProps {
  // filteredProducts: Product[];
  products: Product[];
  editProduct: (id: number) => void;
  archiveProduct: (id: number) => void;
  unarchiveProduct: (id: number) => void;
  filterCategory: number | string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  // filteredProducts,
  products,
  editProduct,
  archiveProduct,
  unarchiveProduct,
  filterCategory,

}) => {
  console.log('filterCategory:', filterCategory); // Debugging line
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' }>({
    key: 'name',
    direction: 'asc',
  });

  // Define columns for the table
  const columns = useMemo(
    () => [
      { Header: 'Name', accessor: 'name' as keyof Product, align: 'left' },
      { Header: 'Category', accessor: 'category_name' as keyof Product, align: 'left' },
      { Header: 'Stock', accessor: 'stock' as keyof Product, align: 'right' },
      { Header: 'Price', accessor: 'price' as keyof Product, align: 'right' },
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
            {columns.map((column) => (
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
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* {filteredProducts.map((product) => ( */}
          {sortedProducts.map((product) => (
            <tr key={product.id} className={styles.tableRow}>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}>{product.category_name}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{product.stock}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>₱{product.price}</td>
              <td className={styles.td}>
                <button
                  onClick={() => editProduct(product.id)}
                  className={`${styles2.smallButton} ${styles2.editButton}`}
                >
                  Edit
                </button>
                {filterCategory === 'Archive' ? (
                  <button
                    onClick={() => unarchiveProduct(product.id)}
                    className={`${styles2.smallButton} ${styles2.unarchiveButton}`}
                  >
                    Unarchive
                  </button>
                ) : (
                  <button
                    onClick={() => archiveProduct(product.id)}
                    className={`${styles2.smallButton} ${styles2.archiveButton}`}
                  >
                    Archive
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
