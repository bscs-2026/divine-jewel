import { useEffect, useState, React } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import Styles from '../styles/Tabs.module.css';
import formStyles from '../styles/Form.module.css';
import { getCookieValue } from '@/lib/clientCookieHelper';

interface Branch {
  id: number;
  name: string;
  address_line: string;
}

interface BranchTabsProps {
  branches: Branch[];
  filterBranch: number | string | null;
  setFilterBranch: (id: number | string | null) => void;
  toggleManageBranches: () => void;
  handleAddStocks: () => void;
  handleStockOut: () => void;
  handleTransferStocks: () => void;
  handleMarkDamaged: () => void;
  selectedStocks: { id: number;[key: string]: any }[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

const BranchTabs: React.FC<BranchTabsProps> = ({
  branches = [],
  filterBranch,
  setFilterBranch,
  toggleManageBranches,
  handleAddStocks,
  handleStockOut,
  handleTransferStocks,
  handleMarkDamaged,
  selectedStocks,
  searchQuery,
  setSearchQuery,
  placeholder,
}) => {
  const isStocksSelected = selectedStocks.length > 0;

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setFilterBranch(value === 'null' ? null : value === 'All' ? 'All' : parseInt(value));
  };

  const [roleId, setRoleId] = useState<number | null>(null);

  useEffect(() => {
    const role = parseInt(getCookieValue('role_id') || '0', 10);
    setRoleId(role);
  }, []);

  const isAllowedRole = roleId === 1 || roleId === 2;

  return (
    <div className={Styles.tabsContainer}>
      <div className={Styles.leftTabs}>
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

        {isAllowedRole && (
          <>
            <label className={formStyles.heading2} htmlFor="branch-filter">
              Select Branch:
            </label>
            <select
              className={formStyles.select}
              id="branch-filter"
              value={filterBranch === null || filterBranch === 'All' ? 'All' : filterBranch.toString()}
              onChange={handleBranchChange}
            >
              <option value="All">All</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id.toString()}>
                  {branch.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>

      {isAllowedRole && (
        <div className={Styles.rightButtonGroup}>
          <button
            className={`${Styles.tabsContainerItem} ${filterBranch === 'manage' ? Styles.active : Styles.inactive}`}
            onClick={toggleManageBranches}
          >
            Manage Branches
          </button>

          <button
            className={`${Styles.tabsContainerItem} ${isStocksSelected ? Styles.active : Styles.inactive}`}
            onClick={handleAddStocks}
            disabled={!isStocksSelected}
          >
            Stock In
          </button>

          <button
            className={`${Styles.tabsContainerItem} ${isStocksSelected ? Styles.active : Styles.inactive}`}
            onClick={handleStockOut}
            disabled={!isStocksSelected}
          >
            Stock Out
          </button>

          <button
            className={`${Styles.tabsContainerItem} ${isStocksSelected ? Styles.active : Styles.inactive}`}
            onClick={handleTransferStocks}
            disabled={!isStocksSelected}
          >
            Transfer Stock
          </button>

          <button
            className={`${Styles.tabsContainerItem} ${isStocksSelected ? Styles.active : Styles.inactive}`}
            onClick={handleMarkDamaged}
            disabled={!isStocksSelected}
          >
            Mark as Damaged
          </button>
        </div>
      )}
    </div>
  );
};

export default BranchTabs;
