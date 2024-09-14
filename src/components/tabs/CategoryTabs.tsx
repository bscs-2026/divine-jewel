// src/components/CategoryTabs.tsx
import React from 'react';
import styles from '../styles/Layout2.module.css';


interface Category {
  id: number;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  filterCategory: number | string | null;
  setFilterCategory: (id: number | string | null) => void;
  toggleManageCategories: () => void;
  handleAddProduct: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  filterCategory,
  setFilterCategory,
  toggleManageCategories,
  handleAddProduct
}) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <button
          className={`${styles.tabsContainerItem}  ${filterCategory === null ? styles.active : styles.inactive}`}
          onClick={() => setFilterCategory(null)}
        >
          All
        </button>
        {categories.map(category => (
          <button
            key={category.id}
            className={`${styles.tabsContainerItem} ${filterCategory === category.id ? styles.active : styles.inactive}`}
            onClick={() => setFilterCategory(category.id)}
          >
            {category.name}
          </button>
        ))}
        <button
          className={`${styles.tabsContainerItem} ${filterCategory === 'Archive' ? styles.active : styles.inactive}`}
          onClick={() => setFilterCategory('Archive')}
        >
          Archived
        </button>

        <button
          className={`${styles.tabsContainerItem} ${styles.verticalLine}`}
          onClick={toggleManageCategories}
        >
          Manage Categories
        </button>
      </div>
      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem}`}
          onClick={handleAddProduct}
        >
          Add
        </button>

      </div>
    </div>
  );
};

export default CategoryTabs;
