import React from 'react';
import styles from '../styles/Layout2.module.css';
import formStyles from '../styles/Form.module.css';

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
  handleAddProduct,
}) => {
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterCategory(value === 'null' ? null : parseInt(value));
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <label className={formStyles.heading} htmlFor="category-filter">
          Select Category:
        </label>
        <select
          className={formStyles.select}
          id="category-filter"
          value={filterCategory === null ? 'null' : filterCategory.toString()}
          onChange={handleCategoryChange}
        >
          <option value="null">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id.toString()}>
              {category.name}
            </option>
          ))}
          <option value="Archive">Archived</option>
        </select>
      </div>

      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem} ${
            filterCategory === 'manage' ? styles.active : styles.inactive
          }`}
          onClick={toggleManageCategories}
        >
          Manage Categories
        </button>

        <button
          className={`${styles.tabsContainerItem} ${
            filterCategory === 'add' ? styles.active : styles.inactive
          }`}
          onClick={handleAddProduct}
        >
          Add Product
        </button>
      </div>
    </div>
  );
};

export default CategoryTabs;
