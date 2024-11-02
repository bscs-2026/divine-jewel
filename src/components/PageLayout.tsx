// src/components/Layout.tsx

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import styles from './styles/Layout.module.css';

// Dynamically import LeftSidebar for client-side only
const LeftSidebar = dynamic(() => import('./layout/LeftSidebar'), { ssr: false });

interface LayoutProps {
  children: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  defaultTitle?: string;
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
      <div className={styles.centerContent}>
        <h1>{pageTitle}</h1>
        {children}
      </div>
      {rightSidebarContent && <div className={styles.rightSidebar}>{rightSidebarContent}</div>}
    </div>
  );
};

export default Layout;
