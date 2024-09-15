// src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import styles from '../styles/Layout2.module.css';

interface LayoutProps {
  children: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  defaultTitle?: string; // Optional prop for default title
}

const Layout: React.FC<LayoutProps> = ({ children, rightSidebarContent, defaultTitle = 'Dashboard' }) => {
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle);

  const handleTitleChange = (title: string) => {
    setPageTitle(title);
  };

  useEffect(() => {
    setPageTitle(defaultTitle);
  }, [defaultTitle]);

  return (
    <div className={styles.layout}>
      <div className={styles.leftSidebar}>
        <LeftSidebar onSelectTitle={handleTitleChange} />
      </div>
      <div className={styles.mainContent}>
        <h1>{pageTitle}</h1> {/* Display the page title */}
        {children}
      </div>
    </div>
  );
};
  

export default Layout;