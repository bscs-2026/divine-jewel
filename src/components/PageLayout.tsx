// src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import LeftSidebar from './layout/LeftSidebar';
import styles from './styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  defaultTitle?: string; // Optional prop for default title
}

const Layout: React.FC<LayoutProps> = ({ children, rightSidebarContent, defaultTitle = 'Dashboard' }) => {
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle); // Set the initial title to defaultTitle

  const handleTitleChange = (title: string) => {
    setPageTitle(title);
  };

  useEffect(() => {
    setPageTitle(defaultTitle); // Update title if defaultTitle changes
  }, [defaultTitle]);

  return (
    <div className={styles.layout}>
      <div className={styles.leftSidebar}>
        <LeftSidebar onSelectTitle={handleTitleChange} />
      </div>
      <div className={styles.centerContent}>
        <h1>{pageTitle}</h1> {/* Display the page title */}
        {children}
      </div>
      {rightSidebarContent && (
        <div className={styles.rightSidebar}>
          {rightSidebarContent}
        </div>
      )}
    </div>
  );
};
  

export default Layout;