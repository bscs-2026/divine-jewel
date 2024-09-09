import React, { useState, useEffect } from 'react';
import LeftSidebar from './LeftSidebar';
import styles from '../styles/Layout.module.css';

interface LayoutProps {
  children: React.ReactNode;
  rightSidebarContent?: React.ReactNode;
  defaultTitle?: string; // Optional prop for default title
}

const Layout: React.FC<LayoutProps> = ({ children, rightSidebarContent, defaultTitle = 'Dashboard' }) => {
  const [pageTitle, setPageTitle] = useState<string>(defaultTitle); // Set the initial title to defaultTitle
  const [showRightSidebar, setShowRightSidebar] = useState<boolean>(true); // State to manage right sidebar visibility

  const handleTitleChange = (title: string) => {
    setPageTitle(title);
  };

  const toggleRightSidebar = () => {
    setShowRightSidebar(!showRightSidebar); // Toggle the visibility
  };

  // Hide the right sidebar by default if the page title is "Stocks"
  useEffect(() => {
    setPageTitle(defaultTitle); // Update title if defaultTitle changes

    // Check if the title is "Stocks" and hide the sidebar
    if (defaultTitle === 'Stocks') {
      setShowRightSidebar(false);
    } else {
      setShowRightSidebar(true); // Show by default for other titles
    }
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
      {/* Toggle Button to hide/show right sidebar */}
      <button onClick={toggleRightSidebar} className={styles.toggleButton}>
        {showRightSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      {/* Backdrop */}
      {showRightSidebar && (
        <div
          className={`${styles.backdrop} ${!showRightSidebar && styles.backdropHidden}`}
          onClick={toggleRightSidebar}
        ></div>
      )}
      {/* Sidebar */}
      <div
        className={`${styles.rightSidebar} ${!showRightSidebar && styles.rightSidebarHidden}`}
      >
        {rightSidebarContent}
      </div>
    </div>
  );
};

export default Layout;
