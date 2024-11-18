import React from 'react';
import Search from '@/components/filters/SearchFilter';
import styles from '@/components/styles/Layout2.module.css';
import ReturnOrder from '@/components/forms/ReturnOrder';

interface ReturnItemsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  selectedOrders: any[]; // Array of selected orders
}

const ReturnItems: React.FC<ReturnItemsProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder,
  selectedOrders,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // Handle the "Return Items" button click
  const handleReturnItemsClick = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to return.');
      return;
    }
    setIsModalOpen(true);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.leftTabs}>
        <Search
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder={placeholder}
        />
      </div>
      <div className={styles.rightTabs}>
        <button
          className={`${styles.tabsContainerItem} ${
            selectedOrders.length > 0 ? styles.active : styles.inactive
          }`}
          onClick={handleReturnItemsClick}
          disabled={selectedOrders.length === 0}
        >
          Return Items
        </button>
      </div>

      {/* Modal for handling return items */}
      {isModalOpen && (
        <ReturnOrder
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedOrders={selectedOrders} // Pass selectedOrders if needed
        />
      )}
    </div>
  );
};

export default ReturnItems;
