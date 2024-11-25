import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faMoneyCheck, faHistory, faBox, faBoxes, faWarehouse, faUsers, faHeartCrack } from '@fortawesome/free-solid-svg-icons';
import styles from '@/components/styles/Layout.module.css';
import Spinner from '@/components/loading/Loading';
import { getCookieValue } from '@/lib/clientCookieHelper';
import { hasAccess } from '@/lib/pageAccessHelper';

interface LeftSidebarProps {
  onSelectTitle: (title: string) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onSelectTitle }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [employeeFirstName, setEmployeeFirstName] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setEmployeeFirstName(getCookieValue('first_name'));
    const role = parseInt(getCookieValue('role_id') || '0', 10);
    setRoleId(role);
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (response.ok) {
        router.push('/login');
      } else {
        console.error('Failed to log out');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Conditionally render navigation items based on access
  const renderNavItem = (path: string, title: string, icon: any) => {
    if (roleId && hasAccess(roleId, path)) {
      return (
        <li className={styles.navItem} onClick={() => onSelectTitle(title)}>
          <Link href={path}>
            <FontAwesomeIcon icon={icon} className={styles.icon} />
            {title}
          </Link>
        </li>
      );
    }
    return null; // Do not render if access is not allowed
  };

  return (
    <div className={styles.leftSidebar}>
      <div>
        <div className={styles.header}>
          <Link href="/">
            <img src="/img/divine-jewel-logo.png" alt="Divine Jewel Logo" className={styles.logo} />
          </Link>
          {/* <img
            src="/img/divine.png"
            alt="Divine"
            className={`${styles.avatar} rounded-full`}
          /> */}

        <div>
          <p className={`${styles.greeting} text-black`}>
            Hello,
          </p>
          <p className={`${styles.greetingName} text-black`}>
            {employeeFirstName ? `${employeeFirstName}!` : 'Loading...'}
          </p>
        </div>

        </div>
        <ul className={`${styles.navList}`}>
          {renderNavItem('/dashboard', 'Dashboard', faChartLine)}
          {renderNavItem('/orders', 'Orders', faMoneyCheck)}
          {renderNavItem('/products', 'Products', faBox)}
          {renderNavItem('/stocks', 'Stocks', faBoxes)}
          {renderNavItem('/supplies', 'Supplies', faWarehouse)}
          {renderNavItem('/employees', 'Employees', faUsers)}
          {renderNavItem('/history', 'History', faHistory)}
          {renderNavItem('/returns', 'Returns', faHeartCrack)}
        </ul>
      </div>
      <button
        className={`${styles.logoutButton} mt-auto mx-auto`}
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? 'Logging out...' : 'Logout'}
      </button>

      {loading && <Spinner />}
    </div>
  );
};

export default LeftSidebar;
