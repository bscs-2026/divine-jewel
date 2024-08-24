// src/components/CategoryTabs.tsx
import React from 'react';
import styles from './styles/Layout.module.css';
import styles2 from './styles/Button.module.css';

interface Category {
  id: number;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  filterCategory: number | string | null;
  setFilterCategory: (id: number | string | null) => void;
  toggleManageCategories: () => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, filterCategory, setFilterCategory, toggleManageCategories }) => {
  return (
    <div className={styles.tabsContainer}>
      <button
        className={`${styles2.mediumButton} ${filterCategory === null ? styles2.activeButton : styles2.inactiveButton}`}
        onClick={() => setFilterCategory(null)}
      >
        All
      </button>
      {categories.map(category => (
        <button
          key={category.id}
          className={`${styles2.mediumButton} ${filterCategory === category.id ? styles2.activeButton : styles2.inactiveButton}`}
          onClick={() => setFilterCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
      <button
        className={`${styles2.mediumButton} ${filterCategory === 'Archive' ? styles2.activeButton : styles2.inactiveButton}`}
        onClick={() => setFilterCategory('Archive')}
      >
        Archived
      </button>

      <button
         className={`${styles2.mediumButton}`}
         onClick={toggleManageCategories}
         >
        Manage Categories
      </button>
    </div>
  );
};

export default CategoryTabs;
