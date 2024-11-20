// src/app/stocks/page.tsx

'use client';
import { useEffect, useState, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import StockTable from '@/components/tables/Stocks';
import StockForm from '@/components/forms/Stocks';
import BranchTabs from '@/components/tabs/BranchTabs';
import ManageBranches from '@/components/forms/ManageBranches';
import Modal from '@/components/modals/Modal';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { DeletePrompt, SuccessfulPrompt } from "@/components/prompts/Prompt";
import CircularIndeterminate from '@/components/loading/Loading';
import { Product, Category } from '@/types';

interface Stock {
    id: number;
    product_id: number;
    branch_code: number;
    quantity: number;
    damaged: number;
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
    const [isStockOut, setIsStockOut] = useState(false);
    const [isMarkDamaged, setIsMarkDamaged] = useState(false);
    const [filterBranch, setFilterBranch] = useState<number | string>("All");
    // const [filterBranch, setFilterBranch] = useState<number | string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isManageBranchesModalOpen, setIsManageBranchesModalOpen] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [successAddStockPrompt, setSuccessAddStockPrompt] = useState(false);
    const [successStockOutPrompt, setSuccessStockOutPrompt] = useState<boolean>(false);
    const [successMarkDamagedPrompt, setSuccessMarkDamagedPrompt] = useState<boolean>(false);
    const [successTransferStockPrompt, setSuccessTransferStockPrompt] = useState<boolean>(false);
    const [successAddBranchPrompt, setSuccessAddBranchPrompt] = useState<boolean>(false);
    const [successEditBranchPrompt, setSuccessEditBranchPrompt] = useState<boolean>(false);
    const [successDeleteBranchPrompt, setSuccessDeleteBranchPrompt] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
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
                    category_name: stock.category_name || 'Unknown',
                };
            });

            setStocks(updatedStocks);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = (resetSelected: boolean = true) => {
        setIsModalOpen(false);
        if (resetSelected) {
            setSelectedStocks([]);
        }
    };

    const closeManageBranchesModal = () => {
        setIsManageBranchesModalOpen(false);
    };

    const handleAddStocks = () => {
        setIsTransfer(false);
        setIsStockOut(false);
        setIsMarkDamaged(false);
        setIsModalOpen(true);

    };

    const handleStockOut = () => {
        setIsStockOut(true); 
        setIsTransfer(false);
        setIsMarkDamaged(false);
        setIsModalOpen(true);
    };

    const handleTransferStocks = () => {
        setIsTransfer(true);
        setIsStockOut(false);
        setIsMarkDamaged(false);
        setIsModalOpen(true);
    };

    const handleMarkDamaged = () => {
        setIsMarkDamaged(true);
        setIsTransfer(false);
        setIsStockOut(false);
        setIsModalOpen(true);
    }


    const addStock = async (stock: Stock, batch_id: string, note: string) => {
        if (!stock.product_id || !stock.branch_code || isNaN(stock.quantity)) {
            console.error('Invalid stock data');
            return { ok: false, message: 'Invalid stock data' };
        }

        try {
            setLoading(true);
            setStocks((prevStocks) =>
                prevStocks.map((s) =>
                    s.id === stock.id ? { ...s, quantity: s.quantity + stock.quantity } : s
                )
            );

            const response = await fetch(`/api/stocks/${stock.product_id}/stockIn`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    branch_code: stock.branch_code,
                    quantity: stock.quantity,
                    batch_id,
                    note,
                    
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }
            
            await fetchData();
            setSuccessAddStockPrompt(true);
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const stockOut = async (stock: Stock, batch_id: string, note: string, stock_out_reason: string) => {
        if (!stock.product_id || !stock.branch_code || isNaN(stock.quantity)) {
            console.error('Invalid stock data');
            return { ok: false, message: 'Invalid stock data' };
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/stocks/${stock.product_id}/stockOut`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    branch_code: stock.branch_code,
                    quantity: stock.quantity,
                    batch_id,
                    note,
                    stock_out_reason
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            await fetchData();
            setSuccessStockOutPrompt(true);
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }

    const markDamaged = async (stock: Stock, batch_id: string, note: string) => {
        if (!stock.product_id || !stock.branch_code || isNaN(stock.quantity)) {
            console.error('Invalid stock data');
            return { ok: false, message: 'Invalid stock data' };
        }

        try {
            setLoading(true);
            const response = await fetch(`/api/stocks/${stock.product_id}/damaged`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    branch_code: stock.branch_code,
                    quantity: stock.quantity,
                    batch_id,
                    note
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update stock');
            }

            await fetchData();
            setSuccessMarkDamagedPrompt(true);
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        } finally {
            setLoading(false);
        }
    }

    const transferStock = async (stockDetails: StockDetails) => {
        if (!stockDetails.batch_id || !stockDetails.product_id || !stockDetails.source_branch || !stockDetails.destination_branch || isNaN(stockDetails.quantity)) {
            console.error('Invalid stock transfer data');
            return { ok: false, message: 'Invalid stock transfer data' };
        }

        try {
            setLoading(true);
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
                    batch_id: stockDetails.batch_id,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to transfer stock');
            }

            await fetchData();
            setSuccessTransferStockPrompt(true);
            return { ok: true };
        } catch (error: any) {
            setError(error.message);
            return { ok: false, message: error.message };
        } finally {
            setLoading(false);
        }
    };

    const addBranch = async (branch: Branch) => {
        try {
            setLoading(true);
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
            setSuccessAddBranchPrompt(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const editBranch = async (branch: Branch) => {
        try {
            setLoading(true);
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
            setSuccessEditBranchPrompt(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const deleteBranch = async (id: number) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/stocks/branches/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete branch');
            }

            await fetchData();
            setSuccessDeleteBranchPrompt(true);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const activeProductIds = products.map((product) => product.id);

    const filteredStocks = useMemo(() => {
        const query = searchQuery.toLowerCase();
    
        return stocks.filter((stock) => {
            const branchMatch =
                filterBranch === null || filterBranch === "All" || stock.branch_code === Number(filterBranch);
    
            const searchMatch = stock.product_name.toLowerCase().includes(query);
    
            return branchMatch && searchMatch;
        });
    }, [stocks, filterBranch, searchQuery]);            
      
    const stockSummary = useMemo(() => {
        if (filterBranch === "All") {
          const summary: { [key: number]: { [key: number]: number } } = {};
          stocks.forEach((stock) => {
            if (!summary[stock.product_id]) {
              summary[stock.product_id] = {};
            }
            summary[stock.product_id][stock.branch_code] = stock.quantity;
          });
          return summary;
        }
        return null;
      }, [filterBranch, stocks]);
      

    return (
        <Layout defaultTitle="Stocks">
            {loading && <CircularIndeterminate />}

            <BranchTabs
                branches={branches}
                filterBranch={filterBranch}
                setFilterBranch={setFilterBranch}
                toggleManageBranches={() => setIsManageBranchesModalOpen(!isManageBranchesModalOpen)}
                handleAddStocks={handleAddStocks}
                handleStockOut={handleStockOut}
                handleMarkDamaged={handleMarkDamaged}
                handleTransferStocks={handleTransferStocks}
                selectedStocks={selectedStocks}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                placeholder="Search products"
            />

            <StockTable
                stocks={filteredStocks}
                stockSummary={stockSummary}
                selectedStocks={selectedStocks}
                setSelectedStocks={setSelectedStocks}
                products={products} //for product stock summary per branch
                branches={branches} //for product stock summary per branch
            />

            <Modal show={isModalOpen} onClose={() => closeModal(true)}>
                {selectedStocks.length > 0 && (
                    <StockForm
                        products={products}
                        branches={branches}
                        addStock={addStock}
                        stockOut={stockOut}
                        markDamaged={markDamaged}
                        transferStock={transferStock}
                        selectedStocks={selectedStocks}
                        isStockOut={isStockOut}
                        isMarkDamaged={isMarkDamaged}
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

            <SuccessfulPrompt
                message="Stock added successfully"
                isVisible={successAddStockPrompt}
                onClose={() => setSuccessAddStockPrompt(false)}
            />
            <SuccessfulPrompt
                message="Stock out processed successfully"
                isVisible={successStockOutPrompt}
                onClose={() => setSuccessStockOutPrompt(false)}
            />
            <SuccessfulPrompt
                message="Stock marked as damaged successfully"
                isVisible={successMarkDamagedPrompt}
                onClose={() => setSuccessMarkDamagedPrompt(false)}
            />
            <SuccessfulPrompt
                message="Stock transferred successfully"
                isVisible={successTransferStockPrompt}
                onClose={() => setSuccessTransferStockPrompt(false)}
            />
            <SuccessfulPrompt
                message="Branch added successfully"
                isVisible={successAddBranchPrompt}
                onClose={() => setSuccessAddBranchPrompt(false)}
            />
            <SuccessfulPrompt
                message="Branch updated successfully"
                isVisible={successEditBranchPrompt}
                onClose={() => setSuccessEditBranchPrompt(false)}
            />
            <DeletePrompt
                message="Branch deleted successfully"
                isVisible={successDeleteBranchPrompt}
                onClose={() => setSuccessDeleteBranchPrompt(false)}
            />
        </Layout>
    );
}
