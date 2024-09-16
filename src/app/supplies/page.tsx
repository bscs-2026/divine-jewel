'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/layout/Layout';
import SupplyTable from '../../components/tables/SupplyTable';
import SupplierTabs from '../../components/tabs/SupplierTabs';
import SupplyForm from '../../components/forms/SupplyForm';
import ManageSuppliers from '../../components/forms/ManageSuppliers';
import Modal from '../../components/modals/Modal';

interface Supplier {
  id: number;
  supplier_name: string;
  contact_info?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

interface Supply {
  id: number;
  supply_date?: string;
  supplier_id: number;
  sku?: string;
  material_name: string;
  quantity: number;
  unit_of_measure: string;
  price_per_unit: number;
  total_cost?: number;
  destination_branch_id?: number;
  employee_id?: number;
  note?: string;
  status: 'pending' | 'delivered' | 'cancelled';
}

const SuppliesPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filterSupplier, setFilterSupplier] = useState<number | string | null>(null);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [currentSupply, setCurrentSupply] = useState<Supply | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageSuppliersModalOpen, setIsManageSuppliersModalOpen] = useState(false);
  const [editingSupply, setEditingSupply] = useState<boolean>(false);

  useEffect(() => {
    fetchSuppliers();
    fetchSupplies();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentSupply(null);
    setEditingSupply(false);
  };

  const toggleManageSuppliers = () => setIsManageSuppliersModalOpen(!isManageSuppliersModalOpen);

  const fetchSupplies = async () => {
    try {
      const response = await fetch('/api/supply');
      const data = await response.json();

      if (data && Array.isArray(data.supply_data)) {
        setSupplies(data.supply_data);
      } else {
        throw new Error('Supplies data is not an array');
      }
    } catch (error) {
      console.error('Failed to fetch supplies:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/supply/suppliers');
      const data = await response.json();

      if (data && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      } else if (Array.isArray(data)) {
        setSuppliers(data);
      } else {
        console.error('Suppliers data is not an array:', data);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const addSupplier = async (supplier: Supplier) => {
    try {
      const response = await fetch('/api/supply/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) throw new Error('Failed to add supplier');

      await fetchSuppliers();
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  const editSupplier = async (supplier: Supplier) => {
    if (!supplier.id) return;

    try {
      const response = await fetch(`/api/supply/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) throw new Error('Failed to edit supplier');

      await fetchSuppliers();
    } catch (error) {
      console.error('Failed to edit supplier:', error);
    }
  };

  const deleteSupplier = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supplier?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/supply/suppliers/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to delete supplier');

      await fetchSuppliers();
    } catch (error) {
      console.error('Failed to delete supplier:', error);
    }
  };

  const addSupply = async (supply: Supply) => {
    try {
      const response = await fetch('/api/supply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(supply),
      });

      if (!response.ok) throw new Error('Failed to add supply');

      await fetchSupplies();
    } catch (error) {
      console.error('Failed to add supply:', error);
    }
    closeModal();
  };

  const editSupply = (supplyId: number) => {
    const supplyToEdit = supplies.find((supply) => supply.id === supplyId);
    if (supplyToEdit) {
      setCurrentSupply(supplyToEdit);
      setSelectedSupplier(supplyToEdit.supplier_id);
      setEditingSupply(true);
      openModal();
    }
  };

  const saveSupply = async (supply: Supply) => {
    if (!currentSupply) return;

    const updatedSupply = {
      ...currentSupply,
      ...supply,
    };

    try {
      const response = await fetch(`/api/supply/${currentSupply.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupply),
      });

      if (!response.ok) throw new Error('Failed to save supply');

      setEditingSupply(false);
      setCurrentSupply(null);
      setSelectedSupplier(null);
      await fetchSupplies();
    } catch (error) {
      console.error('Failed to save supply:', error);
    }
    closeModal();
  };

  const deleteSupply = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supply?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/supply/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete supply');

      await fetchSupplies();
    } catch (error) {
      console.error('Failed to delete supply:', error);
    }
  };

  const handleCancelEdit = () => {
    setEditingSupply(false);
    setCurrentSupply(null);
    setSelectedSupplier(null);
    closeModal();
  };

  const filteredSupplies = filterSupplier
    ? supplies.filter((supply) => supply.supplier_id === filterSupplier)
    : supplies;

  return (
    <Layout defaultTitle="Supply">
      <SupplierTabs
        suppliers={suppliers}
        filterSupplier={filterSupplier}
        setFilterSupplier={setFilterSupplier}
        handleAddSupply={openModal}
        toggleManageSuppliers={toggleManageSuppliers}
      />

      <SupplyTable
        supplies={filteredSupplies}
        suppliers={suppliers}
        filterSupplier={filterSupplier}
        editSupply={editSupply}
        deleteSupply={deleteSupply}
      />

      <Modal show={isModalOpen} onClose={closeModal}>
        <SupplyForm
          currentSupply={currentSupply}
          addSupply={addSupply}
          saveSupply
          suppliers={suppliers}
          selectedSupplier={selectedSupplier}
          setSelectedSupplier={setSelectedSupplier}
          handleCancelEdit={handleCancelEdit}
        />
      </Modal>

      <Modal show={isManageSuppliersModalOpen} onClose={toggleManageSuppliers}>
        <ManageSuppliers
          suppliers={suppliers}
          addSupplier={addSupplier}
          editSupplier={editSupplier}
          deleteSupplier={deleteSupplier}
        />
      </Modal>
    </Layout>
  );
};

export default SuppliesPage;
