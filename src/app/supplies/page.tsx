'use client';

import React, { useState, useEffect, use } from 'react';
import Layout from '@/components/layout/Layout';
import SupplyTable from '@/components/tables/Supply';
import SupplierTabs from '@/components/tabs/SupplierTabs';
import SupplyForm from '@/components/forms/Supply';
import ManageSuppliers from '@/components/forms/ManageSuppliers';
import Modal from '@/components/modals/Modal';
import SupplyBatchForm from '@/components/forms/SupplyBatch';
import { generateBatchID } from '@/lib/generatorHelper';
import { DeletePrompt, SuccessfulPrompt } from "@/components/prompts/Prompt";
import CircularIndeterminate from '@/components/loading/Loading';

interface Supplier {
  id: number;
  supplier_name: string;
}

interface Supply {
  id: number;
  supplier_id: number;
  batch_id: string;
  supply_date: string;
  supplier_name: string;
  status: 'Pending' | 'Delivered' | 'Cancelled';
}

const SuppliesPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filterSupplier, setFilterSupplier] = useState<number | string | null>(null);
  const [supplies, setSupplies] = useState<Supply[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManageSuppliersModalOpen, setIsManageSuppliersModalOpen] = useState(false);
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [successAddSupplyPrompt, setSuccessAddSupplyPrompt] = useState<boolean>(false);
  const [sucessAddSupplierPrompt, setSuccessAddSupplierPrompt] = useState<boolean>(false);
  const [successDeleteSupplierPrompt, setSuccessDeleteSupplierPrompt] = useState<boolean>(false);
  const [successEditSupplierPrompt, setSuccessEditSupplierPrompt] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSuppliers();
    fetchSupplies();
  }, []);

  const fetchSupplies = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/supply');
      const data = await response.json();
      if (data && Array.isArray(data.supply_data)) {
        setSupplies(data.supply_data);
      }
    } catch (error) {
      console.error('Failed to fetch supplies:', error);
    }
    setLoading(false);
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('/api/supply/suppliers');
      const data = await response.json();
      if (data && Array.isArray(data.suppliers)) {
        setSuppliers(data.suppliers);
      }
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    }
  };

  const fetchSupplyDetails = (batch_id: string) => {
    setSelectedBatchId(batch_id);
    setIsBatchModalOpen(true);
  };

  const closeBatchModal = () => {
    setSelectedBatchId(null);
    setIsBatchModalOpen(false);
  };

  const addSupply = async (supplies: Supply[], status: 'Pending' | 'Delivered'): Promise<{ ok: boolean }> => {
    setLoading(true);
    try {
      const batchID = generateBatchID();
      const suppliesWithBatchID = supplies.map(supply => ({ ...supply, batch_id: batchID }));

      const response = await fetch('/api/supply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplies: suppliesWithBatchID }),
      });

      if (!response.ok) {
        throw new Error('Failed to add supplies');
      }

      await fetchSupplies();
      setSuccessAddSupplyPrompt(true);
      return { ok: true };
    } catch (error) {
      console.error('Failed to add supplies:', error);
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const deleteSupply = async (id: number) => {
    try {
      const response = await fetch(`/api/supply/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete supply');
      }
      setSupplies((prevSupplies) => prevSupplies.filter((supply) => supply.id !== id));
    } catch (error) {
      console.error('Error deleting supply:', error);
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      const response = await fetch(`/api/supply/suppliers/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete supplier');
      }
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
      setSuccessDeleteSupplierPrompt(true);
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  const addSupplier = async (newSupplier: Supplier) => {
    try {
      const response = await fetch('/api/supply/suppliers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSupplier),
      });

      if (!response.ok) {
        throw new Error('Failed to add supplier');
      }

      await fetchSuppliers();
      setSuccessAddSupplierPrompt(true);
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const editSupplier = async (updatedSupplier: Supplier) => {
    try {
      const response = await fetch(`/api/supply/suppliers/${updatedSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupplier),
      });

      if (!response.ok) {
        throw new Error('Failed to edit supplier');
      }

      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.id === updatedSupplier.id ? updatedSupplier : supplier
        )
      );
      setSuccessEditSupplierPrompt(true);
    } catch (error) {
      console.error('Error editing supplier:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleManageSuppliers = () => setIsManageSuppliersModalOpen(!isManageSuppliersModalOpen);

  const filteredSupplies = filterSupplier
    ? supplies.filter(supply => supply.supplier_id === filterSupplier)
    : supplies;

  return (
    <Layout defaultTitle="Supply">
      {loading && (
        <CircularIndeterminate />
      )}

      <SupplierTabs
        suppliers={suppliers}
        filterSupplier={filterSupplier}
        setFilterSupplier={setFilterSupplier}
        handleAddSupply={openModal}
        toggleManageSuppliers={toggleManageSuppliers}
      />

      <SupplyTable
        supplies={filteredSupplies}
        fetchSupplyDetails={fetchSupplyDetails}
        filterSupplier={filterSupplier}
      />

      {selectedBatchId && (
        <Modal show={isBatchModalOpen} onClose={closeBatchModal}>
          <SupplyBatchForm batchId={selectedBatchId} onClose={closeBatchModal} />
        </Modal>
      )}

      <Modal show={isModalOpen} onClose={closeModal}>
        <SupplyForm addSupply={addSupply} suppliers={suppliers} onClose={closeModal} />
      </Modal>

      <Modal show={isManageSuppliersModalOpen} onClose={toggleManageSuppliers}>
        <ManageSuppliers
          suppliers={suppliers}
          addSupplier={addSupplier}
          editSupplier={editSupplier}
          deleteSupplier={deleteSupplier}
        />
      </Modal>

      <SuccessfulPrompt
        message="Supply added successfully"
        isVisible={successAddSupplyPrompt}
        onClose={() => setSuccessAddSupplyPrompt(false)}
      />
      <SuccessfulPrompt
        message="Supplier added successfully"
        isVisible={sucessAddSupplierPrompt}
        onClose={() => setSuccessAddSupplierPrompt(false)}
      />
      <SuccessfulPrompt
        message="Supplier updated successfully"
        isVisible={successEditSupplierPrompt}
        onClose={() => setSuccessEditSupplierPrompt(false)}
      />
      <DeletePrompt
        message="Supplier deleted successfully"
        isVisible={successDeleteSupplierPrompt}
        onClose={() => setSuccessDeleteSupplierPrompt(false)}
      />
    </Layout>
  );
};

export default SuppliesPage;
