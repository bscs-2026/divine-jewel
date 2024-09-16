import React from 'react';
import styles from '../styles/Layout.module.css';
import styles2 from '../styles/Button.module.css';

interface CategoryTabsProps {
    categories: string[];
    filterCategory: string | null;
    setFilterCategory: (category: string | null) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, filterCategory, setFilterCategory }) => {
    return (
        <div className={styles.tabsContainer}>
            <button
                className={`${styles2.mediumButton} ${filterCategory === null ? styles2.activeButton : styles2.inactiveButton}`}
                onClick={() => setFilterCategory(null)}
            >
                All
            </button>
            {categories.map((category, index) => (
                <button
                    key={index}
                    className={`${styles2.mediumButton} ${filterCategory === category ? styles2.activeButton : styles2.inactiveButton}`}
                    onClick={() => setFilterCategory(category)}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
