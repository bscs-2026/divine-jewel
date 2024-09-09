import React from 'react';
import styles from '../styles/Layout2.module.css';

interface Branch {
  id: number;
  address_line: string;
}

interface BranchTabsProps {
  branches: Branch[];
  filterBranch: number | string | null;
  setFilterBranch: (id: number | string | null) => void;
  toggleManageBranches: () => void;
  handleAddStocks: () => void;
  handleTransferStocks: () => void;
  selectedStocks: any[]; // Accept selected stocks as prop to determine button state
}

const BranchTabs: React.FC<BranchTabsProps> = ({
  branches,
  filterBranch,
  setFilterBranch,
  toggleManageBranches,
  handleAddStocks,
  handleTransferStocks,
  selectedStocks, // Use selectedStocks to disable buttons when empty
}) => {
  const isStocksSelected = selectedStocks.length > 0; // Check if stocks are selected

  return (
    <div className={styles.tabsContainer}>
      {/* Left-aligned branch buttons */}
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
            {branch.address_line}
          </button>
        ))}
        {/* Add vertical line before Manage Branches */}
        <button
          className={`${styles.tabsContainerItem} ${styles.verticalLine}`}
          onClick={toggleManageBranches}
        >
          Manage Branches
        </button>
      </div>

      {/* Right-aligned button group for Add and Transfer */}
      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem}`}
          onClick={handleAddStocks}
          disabled={!isStocksSelected}
        >
          Add
        </button>
        <button
          className={`${styles.tabsContainerItem}`}
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
