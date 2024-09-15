import React, { useEffect, useState } from 'react';
import styles from '../styles/Modal.module.css';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 600);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!show) {
    return null;
  }

  // Handle clicking outside the modal content to close it
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