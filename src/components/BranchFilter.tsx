import React from 'react';
import styles from './styles/Layout.module.css';
import styles2 from './styles/Button.module.css';

interface Branch {
    id: number;
    address_line: string;
}

interface BranchFilterProps {
    branches: Branch[];
    selectedBranch: string | null;
    setSelectedBranch: (branch: string) => void;
}
const BranchFilter: React.FC<BranchFilterProps> = ({ branches, selectedBranch, setSelectedBranch }) => {
    return (
        <div className={styles.categoryTabsContainer}>
        </div>
    );
}