// src/pages/supplies/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import Layout from '../../components/PageLayout';
import SupplyTable from '../../components/SupplyTable';
import SupplierTabs from '../../components/SupplierTabs';
import SupplyForm from '../../components/SupplyForm';

interface Supplier {
  id?: number;
  supplier_name: string;
  contact_info?: string;
  address?: string;
  email?: string;
  phone_number?: string;
}

interface Supply {
  id?: number;
  supply_date?: string;
  supplier_id: number;
  sku: string;
  material_name: string;
  quantity: number;
  unit_of_measure: string;
  price_per_unit: number;
  destination_branch_id?: number;
  employee_id?: number;
  note?: string;
  status: 'pending' | 'delivered' | 'cancelled';
}

const suppliesPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filterSupplier, setFilterSupplier] = useState<number | string | null>(null);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [currentSupply, setCurrentSupply] = useState<Supply | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [editSupply, setEditSupply] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [showManageSuppliers, setShowManageSuppliers] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'supplies' | 'suppliers' | 'editSupplier' | 'deleteSupplier'>('supplies');

  useEffect(() => {
    fetchSuppliers();
    fetchSupplies();
  }, []);

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
      console.error('Failed to fetch supplies:', error.message);
    } finally {
      setLoading(false);
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) throw new Error('Failed to add supplier');

      fetchSuppliers();
    } catch (error) {
      console.error('Failed to add supplier:', error);
    }
  };

  const editSupplier = async (supplier: Supplier) => {
    if (!supplier.id) return;

    try {
      const response = await fetch(`/api/supply/suppliers/${supplier.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      });

      if (!response.ok) throw new Error('Failed to edit supplier');

      fetchSuppliers();
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
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to delete supplier');

      fetchSuppliers();
    } catch (error) {
      console.error('Failed to delete supplier:', error.message);
    }
  };

  const addSupply = async (supply: Supply) => {
    try {
      const response = await fetch('/api/supply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supply),
      });

      if (!response.ok) throw new Error('Failed to add supply');

      fetchSupplies();
    } catch (error) {
      console.error('Failed to add supply:', error);
    }
  };

  const saveSupply = async (supply: Supply) => {
    try {
      const response = await fetch(`/api/supply/${supply.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supply),
      });

      if (!response.ok) throw new Error('Failed to save supply');

      fetchSupplies();
      setEditSupply(false);
      setCurrentSupply(null);
    } catch (error) {
      console.error('Failed to save supply:', error);
    }
  };

  const deleteSupply = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this supply?');
    if (!confirmDelete) return;
    
    try {
      const response = await fetch(`/api/supply/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete supply');

      fetchSupplies();
    } catch (error) {
      console.error('Failed to delete supply:', error);
    }
  };

  const handleSelectedToEdit = (id: number) => {
    const supply = supplies.find((supply) => supply.id === id);
    if (supply) {
      setCurrentSupply(supply);
      setEditSupply(true);
      setActiveTab('supplies');
      setShowManageSuppliers(false);
    }
  };

  const handleCancelEdit = () => {
    setEditSupply(false);
    setCurrentSupply(null);
  };

  return (
    <Layout
      defaultTitle="Supplies"
      rightSidebarContent={
        !showManageSuppliers && (
          <SupplyForm
            currentSupply={currentSupply}
            addSupply={addSupply}
            saveSupply={saveSupply}
            suppliers={suppliers}
            addSupplier={addSupplier}
            editSupplier={editSupplier}
            deleteSupplier={deleteSupplier}
            selectedSupplier={selectedSupplier}
            setSelectedSupplier={setSelectedSupplier}
            handleCancelEdit={handleCancelEdit}
            switchToSuppliesTab={() => setActiveTab('supplies')}
            setActiveTab={setActiveTab}
            setCurrentSupply={setCurrentSupply}
            activeTab={activeTab}
          />
        )
      }
    >
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <SupplierTabs
            suppliers={suppliers}
            filterSupplier={filterSupplier}
            setFilterSupplier={setFilterSupplier}
          />
          <SupplyTable
            supplies={supplies}
            suppliers={suppliers}
            filterSupplier={filterSupplier}
            editSupply={handleSelectedToEdit}
            deleteSupply={(id) => {
              deleteSupply(id);
              fetchSupplies();
            }}
            setActiveTab={setActiveTab}
          />
        </>
      )}
    </Layout>
  );
};

export default suppliesPage;
