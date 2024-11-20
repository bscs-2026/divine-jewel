import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  const [isLargeScreen, setIsLargeScreen] = useState<boolean | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 600);
    };

    // Ensure this runs only on the client
    if (typeof window !== 'undefined') {
      setIsLargeScreen(window.innerWidth >= 600); // Initial check
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  if (!show) {
    return null;
  }

  if (isLargeScreen === null) {
    // Prevent rendering until screen size is determined
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
      <div className={`${styles.modalContent} ${isLargeScreen ? styles.modalContentBig : styles.modalContentMedium}`}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
