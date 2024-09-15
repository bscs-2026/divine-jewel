import React from 'react';
import styles from '../styles/Layout2.module.css';

interface Branch {
  id: number;
  name: string;
  address_line: string;
}

interface BranchTabsProps {
  branches: Branch[];
  filterBranch: number | string | null;
  setFilterBranch: (id: number | string | null) => void;
  toggleManageBranches: () => void;
  handleAddStocks: () => void;
  handleTransferStocks: () => void;
  selectedStocks: { id: number; [key: string]: any }[];
}

const BranchTabs: React.FC<BranchTabsProps> = ({
  branches = [],
  filterBranch,
  setFilterBranch,
  toggleManageBranches,
  handleAddStocks,
  handleTransferStocks,
  selectedStocks,
}) => {
  const isStocksSelected = selectedStocks.length > 0;

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <button
          className={`${styles.tabsContainerItem} ${filterBranch === null ? styles.active : styles.inactive}`}
          onClick={() => setFilterBranch(null)}
        >
          All
        </button>
        {branches.map((branch) => (
          <button
            key={branch.id}
            className={`${styles.tabsContainerItem} ${filterBranch === branch.id ? styles.active : styles.inactive}`}
            onClick={() => setFilterBranch(branch.id)}
          >
            {branch.name}
          </button>
        ))}
        <button
          className={`${styles.tabsContainerItem} ${styles.verticalLine}`}
          onClick={toggleManageBranches}
        >
          Manage Branches
        </button>
      </div>

      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem} ${styles.boldButton}`}
          onClick={handleAddStocks}
          disabled={!isStocksSelected}
        >
          Add
        </button>
        <button
          className={`${styles.tabsContainerItem} ${styles.boldButton}`}
          onClick={handleTransferStocks}
          disabled={!isStocksSelected}
        >
          Transfer
        </button>
      </div>
    </div>
  );
};

export default BranchTabs;
