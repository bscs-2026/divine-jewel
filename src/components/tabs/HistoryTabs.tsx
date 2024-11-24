import React from 'react';
import styles from '../styles/Layout2.module.css';

interface HistoryTabsProps {
  selectedTab: 'transaction' | 'stocks' | 'productHistory';
  setSelectedTab: (tab: 'transaction' | 'stocks' | 'productHistory') => void;
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
          Orders
        </button>
        <button
          className={`${styles.tabsContainerItem} ${selectedTab === 'productHistory' ? styles.active : styles.inactive}`}
          onClick={() => setSelectedTab('productHistory')}
        >
          Product
        </button>
      </div>
    </div>
  );
};

export default HistoryTabs;
