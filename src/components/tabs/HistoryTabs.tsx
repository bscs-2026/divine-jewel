import React from 'react';
import styles from '../styles/Layout2.module.css';

interface HistoryTabsProps {
  selectedTab: 'transaction' | 'stocks';
  setSelectedTab: (tab: 'transaction' | 'stocks') => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ selectedTab, setSelectedTab }) => {
  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <button
          className={`${styles.tabsContainerItem} ${selectedTab === 'stocks' ? styles.active : styles.inactive}`}
          onClick={() => setSelectedTab('stocks')}
        >
          Stocks
        </button>
        <button
          className={`${styles.tabsContainerItem} ${selectedTab === 'transaction' ? styles.active : styles.inactive}`}
          onClick={() => setSelectedTab('transaction')}
        >
          Transaction
        </button>
      </div>
    </div>
  );
};

export default HistoryTabs;
