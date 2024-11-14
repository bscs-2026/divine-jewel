// src/components/filters/Search.tsx

import { ChangeEvent } from 'react';
import styles from '../styles/Layout2.module.css';

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Search({ searchQuery, setSearchQuery }: SearchProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder="Search by product name"
      value={searchQuery}
      onChange={handleSearchChange}
      className={styles.searchInput}
    />
  );
}
