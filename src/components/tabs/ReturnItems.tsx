import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Styles from '@/components/styles/Tabs.module.css';
import Modal from '@/components/modals/Modal';
import CustomersCredit from '@/components/forms/CustomersCredit';
import ReturnItemsForm from '@/components/forms/ReturnItems';

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
  credits: {
    id: number;
    customer_name: string;
    credit_amount: number | string;
    credit_date: string;
    expiration_date: string | null;
    status: string;
    credit_type: string;
    description: string | null;
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
      customer_name?: string;
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
  credits,
  returnItem,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreditsModalOpen, setIsCreditsModalOpen] = useState(false);

  const handleReturnItemsClick = () => {
    if (selectedOrders.length === 0) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleViewCustomerCredits = () => {
    setIsCreditsModalOpen(true);
  };

  const handleCloseCreditsModal = () => {
    setIsCreditsModalOpen(false);
  };

  const handleCloseReturnItemsModal = () => {
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
        {/* Return Items Button */}
        <button
          className={`${Styles.tabsContainerItem} ${
            selectedOrders.length > 0 ? Styles.active : Styles.inactive
          }`}
          onClick={handleReturnItemsClick}
          disabled={selectedOrders.length === 0}
        >
          Return Items
        </button>

        {/* Customer Credit Button */}
        <button
          className={`${Styles.tabsContainerItem} ${Styles.active}`}
          onClick={handleViewCustomerCredits}
        >
          View Credits
        </button>
      </div>

      {/* Customer Credits Modal */}
      <Modal show={isCreditsModalOpen} onClose={handleCloseCreditsModal}>
        <CustomersCredit credits={credits} />
      </Modal>

      {/* Return Items Modal */}
      <Modal show={isModalOpen} onClose={handleCloseReturnItemsModal}>
        {selectedOrders.length > 0 && (
          <ReturnItemsForm
            selectedOrders={selectedOrders}
            returnItem={returnItem}
            onClose={handleCloseReturnItemsModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default ReturnItemsTabs;
