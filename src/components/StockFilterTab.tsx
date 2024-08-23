import React from 'react';
import styles from './styles/Layout.module.css';
import styles2 from './styles/Button.module.css';

interface Branch {
  id: number;
  address_line: string;
}

interface StockFilterTabsProps {
  branches: Branch[];
  filterBranch: number | string | null;
  setFilterBranch: (id: number | string | null) => void;
}

const StockFilterTabs: React.FC<StockFilterTabsProps> = ({ branches, filterBranch, setFilterBranch }) => {
  return (
    <div className={styles.categoryTabsContainer}>
      <button
        className={`${styles2.mediumButton} ${filterBranch === null ? styles2.activeButton : styles2.inactiveButton}`}
        onClick={() => setFilterBranch(null)}
      >
        All
      </button>
      {branches.map(branch => (
        <button
          key={branch.id}
          className={`${styles2.mediumButton} ${filterBranch === branch.id ? styles2.activeButton : styles2.inactiveButton}`}
          onClick={() => setFilterBranch(branch.id)}
        >
          {branch.address_line}
        </button>
      ))}
    </div>
  );
};

export default StockFilterTabs;
