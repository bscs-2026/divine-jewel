import React from 'react';
import styles from './styles/Table.module.css';
import styles2 from './styles/Button.module.css';

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
  filteredProducts: Product[];
  editProduct: (id: number) => void;
  archiveProduct: (id: number) => void;
  unarchiveProduct: (id: number) => void;
  filterCategory: number | string | null;
}

const ProductTable: React.FC<ProductTableProps> = ({
  filteredProducts,
  editProduct,
  archiveProduct,
  unarchiveProduct,
  filterCategory
}) => {
  console.log('filterCategory:', filterCategory); // Debugging line

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>ID</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Stock</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product.id} className={styles.borderT}>
              <td className={styles.td}>{product.id}</td>
              <td className={styles.td}>{product.name}</td>
              <td className={styles.td}>{product.stock}</td>
              <td className={styles.td}>₱{product.price}</td>
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
