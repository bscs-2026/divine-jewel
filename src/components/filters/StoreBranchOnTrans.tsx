// src/components/filters/StoreBranchOnTrans.tsx

import React from 'react';
import styles from '../styles/Form.module.css';

interface Branch {
  branch_code: number;
  branch_name: string;
  branch_address: string;
}

interface BranchFilterProps {
  branches: Branch[];
  selectedBranch: Branch | null;
  onBranchChange: (branch: Branch | null) => void;
}

const BranchFilter: React.FC<BranchFilterProps> = ({ branches, selectedBranch, onBranchChange }) => {
  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranchName = event.target.value;
    const selected = branches.find(branch => branch.branch_name === selectedBranchName);
    onBranchChange(selected || null);
  };

  // Filter out unique branch names (ensuring uniqueness based on branch_name)
  const uniqueBranches = Array.from(new Set(branches.map(branch => branch.branch_name)));

  return (
    <div>
      <label className={styles.heading} htmlFor="branch-filter">Select Branch: </label>
      <select
        className={styles.select}
        id="branch-filter"
        value={selectedBranch?.branch_name || ''}
        onChange={handleBranchChange}
      >
        <option value="">All Branches</option>
        {uniqueBranches.map((branch_name, index) => (
          <option key={index} value={branch_name}>
            {branch_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default BranchFilter;

