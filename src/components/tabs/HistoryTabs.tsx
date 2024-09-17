// /components/tabs/HistoryTabs.tsx
import React from 'react';
import styles from '../styles/Layout2.module.css';

interface HistoryTabsProps {
  filterAction: string | null;
  setFilterAction: (action: string | null) => void;
}

const HistoryTabs: React.FC<HistoryTabsProps> = ({ filterAction, setFilterAction }) => {
  const actions = ['All', 'Add', 'Transfer'];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        {actions.map((action) => (
          <button
            key={action}
            className={`${styles.tabsContainerItem} ${
              filterAction === (action === 'All' ? null : action.toLowerCase()) ? styles.active : styles.inactive
            }`}
            onClick={() => setFilterAction(action === 'All' ? null : action.toLowerCase())}
          >
            {action}
          </button>
        ))}
      </div>
    </div>
  );
};

export default HistoryTabs;
