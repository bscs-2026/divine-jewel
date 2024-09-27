'use client';
import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import StockTable from '../../components/tables/StockTable';
import StockForm from '../../components/forms/StockForm';
import BranchTabs from '../../components/tabs/BranchTabs';
import ManageBranches from '../../components/forms/ManageBranches';
import Modal from '../../components/modals/Modal';
import DeleteConfirmationModal from '../../components/modals/DeleteConfirmationModal';

interface Stock {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
    product_name: string;
    product_SKU: string;
    category_name: string;
    product_size: string;   
    product_color: string;
    branch_name: string;
    last_updated: string;
}

interface Product {
    id: number;
    SKU: string;
    name: string;
    size: string;
    color: string;
    is_archive: number | boolean;
}

interface Branch {
    id: number;
    name: string;
    address_line: string;
}

interface StockDetails {
    batch_id: string;
    product_id: number;
    source_branch: number;
    destination_branch: number;
    quantity: number;
    note: string;
}

export default function StocksPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [branches, setBranches] = useState<Branch[]>([]);
    const [selectedStocks, setSelectedStocks] = useState<Stock[]>([]);
    const [isTransfer, setIsTransfer] = useState(false);
    const [filterBranch, setFilterBranch] = useState<number | string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageBranchesModalOpen, setIsManageBranchesModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [branchesRes, productsRes, stocksRes] = await Promise.all([
                fetch('/api/stocks/branches'),
                fetch('/api/products'),
                fetch('/api/stocks')
            ]);

            if (!branchesRes.ok || !productsRes.ok || !stocksRes.ok) {
                throw new Error('Failed to fetch data');
            }

            const branchesData = await branchesRes.json();
            const productsData = await productsRes.json();
            const stocksData = await stocksRes.json();

            setBranches(branchesData.branches);
            setProducts(productsData.products.filter((product: Product) => !product.is_archive));

            const updatedStocks = stocksData.stocks.map((stock: Stock) => {
                const branch = branchesData.branches.find((branch: Branch) => branch.id === stock.branch_code);
                return { 
                    ...stock, 
                    branch_name: branch ? branch.name : 'Unknown',
                    category_name: stock.category_name || 'Unknown',  // Ensure category_name is present
                };
            });

            setStocks(updatedStocks);
        } catch (error: any) {
            setError(error.message);
        }
    };

    const closeModal = (resetSelected: boolean = true) => {
        setIsModalOpen(false);
        if (resetSelected) {
            setSelectedStocks([]);
        }
    };

    const handleAddStocks = () => {
        setIsTransfer(false);
        setIsModalOpen(true);
    };

    const handleTransferStocks = () => {
        setIsTransfer(true);
        setIsModalOpen(true);
    };

    const addStock = async (stock: Stock, batch_id: string) => { // Accept batch_id as a parameter
        if (!stock.product_id || !stock.branch_code || isNaN(stock.quantity)) {
            console.error('Invalid stock data');
            return { ok: false, message: 'Invalid stock data' };
        }
    
        try {
            setStocks((prevStocks) =>
                prevStocks.map((s) =>
                    s.id === stock.id ? { ...s, quantity: s.quantity + stock.quantity } : s
                )
            );
    
            const response = await fetch(`/api/stocks/${stock.product_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    branch_code: stock.branch_code, 
                    quantity: stock.quantity, 
                    batch_id // Include batch_id here 
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update stock');
            }
    
            await fetchData(); 
    
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        }
    };

    const transferStock = async (stockDetails: StockDetails) => {
        if (!stockDetails.batch_id || !stockDetails.product_id || !stockDetails.source_branch || !stockDetails.destination_branch || isNaN(stockDetails.quantity)) {
            console.error('Invalid stock transfer data');
            return { ok: false, message: 'Invalid stock transfer data' };
        }
    
        try {
            setStocks((prevStocks) =>
                prevStocks.map((s) => {
                    if (s.product_id === stockDetails.product_id && s.branch_code === stockDetails.source_branch) {
                        return { ...s, quantity: s.quantity - stockDetails.quantity };
                    }
                    if (s.product_id === stockDetails.product_id && s.branch_code === stockDetails.destination_branch) {
                        return { ...s, quantity: s.quantity + stockDetails.quantity };
                    }
                    return s;
                })
            );
    
            const response = await fetch(`/api/stocks/stock_details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    product_id: stockDetails.product_id,
                    source_branch: stockDetails.source_branch,
                    destination_branch: stockDetails.destination_branch,
                    quantity: stockDetails.quantity,
                    note: stockDetails.note,
                    batch_id: stockDetails.batch_id, // Include batch_id here
                }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to transfer stock');
            }
    
            await fetchData();
    
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        }
    };
    
    const closeManageBranchesModal = () => {
        setIsManageBranchesModalOpen(false);
    };

    const addBranch = async (branch: Branch) => {
        try {
            const response = await fetch('/api/stocks/branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: branch.name,
                    address_line: branch.address_line,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add branch');
            }
    
            await fetchData();
        } catch (error: any) {
            setError(error.message);
        }
    };
    

    const editBranch = async (branch: Branch) => {
        try {
            const response = await fetch(`/api/stocks/branches/${branch.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: branch.name,
                    address_line: branch.address_line,
                }),
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to edit branch');
            }
    
            await fetchData(); 
        } catch (error: any) {
            setError(error.message);
        }
    };

    const deleteBranch = async (id: number) => {
        setBranchToDelete(id);  
        setShowDeleteModal(true);  
    };
    
    const confirmDeleteBranch = async () => {
        if (branchToDelete === null) return;
        try {
            const response = await fetch(`/api/stocks/branches/${branchToDelete}`, {
                method: 'DELETE',
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete branch');
            }
    
            await fetchData();
            setBranchToDelete(null);  
            setShowDeleteModal(false);  
        } catch (error: any) {
            setError(error.message);
        }
    };
    
    const activeProductIds = products.map((product) => product.id);
    const filteredStocks = stocks.filter(
        (stock) =>
            activeProductIds.includes(stock.product_id) &&
            (!filterBranch || stock.branch_code === filterBranch)
    );

    return (
        <Layout defaultTitle="Stocks">
            <BranchTabs
                branches={branches}
                filterBranch={filterBranch}
                setFilterBranch={setFilterBranch}
                toggleManageBranches={() => setIsManageBranchesModalOpen(!isManageBranchesModalOpen)}
                handleAddStocks={handleAddStocks}
                handleTransferStocks={handleTransferStocks}
                selectedStocks={selectedStocks}
            />

            <StockTable
                stocks={filteredStocks}
                selectedStocks={selectedStocks}
                setSelectedStocks={setSelectedStocks}
            />

            <Modal show={isModalOpen} onClose={() => closeModal(true)}>
                {selectedStocks.length > 0 && (
                    <StockForm
                        products={products}
                        branches={branches}
                        addStock={addStock}
                        transferStock={transferStock}
                        selectedStocks={selectedStocks}
                        isTransfer={isTransfer}
                        onClose={(reset) => closeModal(reset)}
                    />
                )}
            </Modal>

            <Modal show={isManageBranchesModalOpen} onClose={closeManageBranchesModal}>
                <ManageBranches
                    branches={branches}
                    addBranch={addBranch}
                    editBranch={editBranch}
                    deleteBranch={deleteBranch}
                />
            </Modal>

            <DeleteConfirmationModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDeleteBranch}
            />
        </Layout>
    );
}
