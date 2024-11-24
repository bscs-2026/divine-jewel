import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Search from '@/components/filters/SearchFilter';
import Styles from '../styles/Tabs.module.css';
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  categories,
  filterCategory,
  setFilterCategory,
  toggleManageCategories,
  handleAddProduct,
  searchQuery,
  setSearchQuery,
  placeholder
}) => {

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterCategory(value === 'null' ? null : value === 'Archive' ? 'Archive' : parseInt(value));
  };

  return (
    <div className={Styles.tabsContainer}>
      <div className={Styles.leftTabs}>

        <div className={Styles.searchContainer}>
          <SearchIcon className={Styles.searchIcon} />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={Styles.searchInput}
          />
        </div>
        <div className={Styles.selectContainer}>
          <label className={Styles.heading2} htmlFor="category-filter">
            Select Category:
          </label>
          <select
            className={Styles.tabsSelect}
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
      </div>

      <div className={Styles.rightButtonGroup}>
        <button
          className={`${Styles.tabsContainerItem} ${filterCategory === 'manage' ? Styles.active : Styles.inactive
            }`}
          onClick={toggleManageCategories}
        >
          Manage Categories
        </button>

        <button
          className={`${Styles.tabsContainerItem} ${filterCategory === 'add' ? Styles.active : Styles.inactive
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
