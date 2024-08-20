// src/components/LeftSidebar.tsx

import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faMoneyCheck, faHistory, faBox, faWarehouse, faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from './styles/Layout.module.css';

interface LeftSidebarProps {
  onSelectTitle: (title: string) => void;  // Callback to update the title in Layout
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onSelectTitle }) => {
  return (
    <div className={styles.leftSidebar}>
      <div>
        <div className={styles.header}>
          <img src="/img/divine-jewel-logo.png" alt="Divine Jewel Logo" className={styles.logo} />
          <img
            src="/img/fai.png"
            alt="Fai"
            className={`${styles.avatar} rounded-full`}
          />
          <p className={`${styles.greeting} text-black`}>Hello, Fai!</p>
        </div>
        <ul className={`${styles.navList}`}>
          <li className={styles.navItem} onClick={() => onSelectTitle('Sales')}>
            <Link href="/sales">
              <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
              Sales
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Transactions')}>
            <Link href="/transactions">
              <FontAwesomeIcon icon={faMoneyCheck} className={styles.icon} />
              Transactions
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('History')}>
            <Link href="/history">
              <FontAwesomeIcon icon={faHistory} className={styles.icon} />
              History
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Products')}>
            <Link href="/products">
              <FontAwesomeIcon icon={faBox} className={styles.icon} />
              Products
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Stocks')}>
            <Link href="/stocks">
              <FontAwesomeIcon icon={faWarehouse} className={styles.icon} />
              Stocks
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Employees')}>
            <Link href="/employees">
              <FontAwesomeIcon icon={faUsers} className={styles.icon} />
              Employees
            </Link>
          </li>
        </ul>
      </div>
      <button className={`${styles.logoutButton} mt-auto mx-auto`}>
        Logout
      </button>
    </div>
  );
};

export default LeftSidebar;
