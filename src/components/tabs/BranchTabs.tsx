import React from 'react';
import styles from '../styles/Layout2.module.css';
import formStyles from '../styles/Form.module.css';

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

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterBranch(value === 'null' ? null : parseInt(value));
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <label className={formStyles.heading} htmlFor="branch-filter">
          Select Branch:
        </label>
        <select
          className={formStyles.select}
          id="branch-filter"
          value={filterBranch === null ? 'null' : filterBranch.toString()}
          onChange={handleBranchChange}
        >
          <option value="null">All</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id.toString()}>
              {branch.name}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.rightButtonGroup}>
        <button
          className={`${styles.tabsContainerItem} ${
            filterBranch === 'manage' ? styles.active : styles.inactive
          }`}
          onClick={toggleManageBranches}
        >
          Manage Branches
        </button>

        <button
          className={`${styles.tabsContainerItem} ${
            isStocksSelected ? styles.active : styles.inactive
          }`}
          onClick={handleAddStocks}
          disabled={!isStocksSelected}
        >
          Add Stock
        </button>

        <button
          className={`${styles.tabsContainerItem} ${
            isStocksSelected ? styles.active : styles.inactive
          }`}
          onClick={handleTransferStocks}
          disabled={!isStocksSelected}
        >
          Transfer Stock
        </button>
      </div>
    </div>
  );
};

export default BranchTabs;
