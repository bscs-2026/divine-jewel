// src/components/filters/Search.tsx

import { ChangeEvent } from 'react';
import styles from '../styles/Layout2.module.css';

interface SearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder?: string;
}

export default function Search({ searchQuery, setSearchQuery, placeholder = 'Search' }: SearchProps) {
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={searchQuery}
      onChange={handleSearchChange}
      className={styles.searchInput}
    />
  );
}

