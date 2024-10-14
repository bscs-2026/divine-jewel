import React, { useMemo, useState, useEffect } from 'react';
import styles from '../styles/Table.module.css';
import { ArrowUpward, ArrowDownward, Edit, Archive, Unarchive} from '@mui/icons-material';

interface Product {
  id: number;
  SKU: string;
  category_id: number;
  name: string;
  size: string;
  color: string;
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
      { Header: 'SKU', accessor: 'SKU' as keyof Product, align: 'left' },
      { Header: 'Category', accessor: 'category_name' as keyof Product, align: 'left' },
      { Header: 'Size', accessor: 'size' as keyof Product, align: 'left' },
      { Header: 'Color', accessor: 'color' as keyof Product, align: 'left' },
      { Header: 'Price', accessor: 'price' as keyof Product, align: 'right' },
      { Header: 'Stock', accessor: 'stock' as keyof Product, align: 'right' },
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
            <th className={`${styles.td} ${styles.rightAlign}`}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedProducts.map((product) => (
            <tr key={product.id} className={styles.tableRow}>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}>{product.SKU}</td>
              <td className={styles.td}>{product.category_name}</td>
              <td className={styles.td}>{product.size}</td>
              <td className={styles.td}>{product.color}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>₱{product.price}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>{product.stock}</td>
              <td className={`${styles.td} ${styles.rightAlign}`}>    
              {filterCategory !== 'Archive' && product.is_archive !== true && (
                  <Edit
                    onClick={() => editProduct(product.id)} 
                    style={{ cursor: 'pointer', color: '#575757', marginRight: '2px', fontSize: '1.5rem' }}
                  />
                )}
                {filterCategory === 'Archive' ? (
                  <Unarchive
                    onClick={() => unarchiveProduct(product.id)}
                    style={{ cursor: 'pointer', color: '#28a745', fontSize: '1.5rem' }}
                  />
                ) : (
                  <Archive
                    onClick={() => archiveProduct(product.id)}
                    style={{ cursor: 'pointer', color: '#ff4d4f', fontSize: '1.5rem' }}
                  />
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
