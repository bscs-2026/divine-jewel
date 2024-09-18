// /pages/history/index.tsx
'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StockDetailsTable from '../../components/tables/StockDetailsHistory';
import HistoryTabs from '../../components/tabs/HistoryTabs';

interface StockDetail {
  id: number;
  batch_id: number
  product_id: number;
  date: string;
  action: string;
  source_branch: number | null;
  destination_branch: number | null;
  quantity: number;
  note: string;
  employee_id: number | null;

  product_name: string;
  product_SKU: string;
  product_size: string;
  product_color: string;
  source_branch_name: string;
  destination_branch_name: string;
  employee_name: string;
}

const HistoryPage: React.FC = () => {
  const [stockDetails, setStockDetails] = useState<StockDetail[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filterAction, setFilterAction] = useState<string | null>(null);

  useEffect(() => {
    fetchStockDetails();
  }, []);

  const fetchStockDetails = async () => {
    try {
      const response = await fetch('/api,history/stockDetails');
      if (!response.ok) {
        throw new Error('Failed to fetch stock details');
      }
      const data = await response.json();
      setStockDetails(data.stockDetails);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const filteredStockDetails = filterAction
    ? stockDetails.filter((detail) => detail.action === filterAction)
    : stockDetails;

  return (
    <Layout defaultTitle="History">
      <HistoryTabs filterAction={filterAction} setFilterAction={setFilterAction} />
      <StockDetailsTable stockDetails={filteredStockDetails} />
    </Layout>
  );
};

export default HistoryPage;
