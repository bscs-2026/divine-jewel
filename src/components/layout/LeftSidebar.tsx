// src/components/layout/LeftSidebar.tsx

// This component ensures it runs only on the client side using a React component structure.
import React from 'react';
import { useRouter } from 'next/navigation'; // Use `next/navigation` for App Router
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faMoneyCheck, faHistory, faBox, faBoxes, faWarehouse, faUsers } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Layout.module.css';

interface LeftSidebarProps {
  onSelectTitle: (title: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onSelectTitle }) => {
  const router = useRouter(); // Call `useRouter` directly for client-side navigation

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login'); // Navigate to login after successful logout
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={styles.leftSidebar}>
      <div>
        <div className={styles.header}>
          <Link href="/">
            <img src="/img/divine-jewel-logo.png" alt="Divine Jewel Logo" className={styles.logo} />
          </Link>
          <img
            src="/img/divine.png"
            alt="Divine"
            className={`${styles.avatar} rounded-full`}
          />
          <p className={`${styles.greeting} text-black`}>Hello, Divine!</p>
        </div>
        <ul className={`${styles.navList}`}>
          <li className={styles.navItem} onClick={() => onSelectTitle('Sales')}>
            <Link href="/dashboard">
              <FontAwesomeIcon icon={faChartLine} className={styles.icon} />
              Sales
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Orders')}>
            <Link href="/orders">
              <FontAwesomeIcon icon={faMoneyCheck} className={styles.icon} />
              Orders
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
              <FontAwesomeIcon icon={faBoxes} className={styles.icon} />
              Stocks
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Supplies')}>
            <Link href="/supplies">
              <FontAwesomeIcon icon={faWarehouse} className={styles.icon} />
              Supplies
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('Employees')}>
            <Link href="/employees">
              <FontAwesomeIcon icon={faUsers} className={styles.icon} />
              Employees
            </Link>
          </li>
          <li className={styles.navItem} onClick={() => onSelectTitle('History')}>
            <Link href="/history">
              <FontAwesomeIcon icon={faHistory} className={styles.icon} />
              History
            </Link>
          </li>
        </ul>
      </div>
      <button className={`${styles.logoutButton} mt-auto mx-auto`} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default LeftSidebar;
