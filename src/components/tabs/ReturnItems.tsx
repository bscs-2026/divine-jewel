import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Styles from '@/components/styles/Tabs.module.css';
import ReturnItemsForm from '@/components/forms/ReturnItems';
import Modal from '@/components/modals/Modal';

interface ReturnItemsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
  selectedOrders: {
    order_id: number;
    product_name: string;
    product_size: string;
    product_color: string;
    quantity: number;
    unit_price: number;
    discount_percent: number;
    unit_price_deducted: number;
  }[];
  returnItem: (
    item: {
      order_id: number;
      product_name: string;
      product_size: string;
      product_color: string;
      quantity: number;
      unit_price: number;
      discount_percent: number;
      unit_price_deducted: number;
      customer_name?: string
      branch_name?: string;
      branch_address?: string;
      employee_id?: number;
      employee_fullname?: string;
    },
    returnQuantity: number,
    note: string
  ) => Promise<{ ok: boolean; message?: string }>;
}

const ReturnItemsTabs: React.FC<ReturnItemsProps> = ({
  searchQuery,
  setSearchQuery,
  placeholder = 'Search Order ID',
  selectedOrders,
  returnItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReturnItemsClick = () => {
    console.log("Selected orders:", selectedOrders);

    if (selectedOrders.length === 0) {
      alert('Please select at least one order to return.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={Styles.tabsContainer}>
      <div className={Styles.searchContainer}>
        <SearchIcon className={Styles.searchIcon} />
        <input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={Styles.searchInput}
        />
      </div>

      <div className={Styles.rightButtonGroup}>
        <button
          className={`${Styles.tabsContainerItem} ${selectedOrders.length > 0 ? Styles.active : Styles.inactive
            }`}
          onClick={handleReturnItemsClick}
          disabled={selectedOrders.length === 0}
        >
          Return Items
        </button>
      </div>

      <Modal show={isModalOpen} onClose={handleCloseModal}>
        {selectedOrders.length > 0 && (
          <ReturnItemsForm
            selectedOrders={selectedOrders}
            returnItem={returnItem}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReturnItemsTabs;
