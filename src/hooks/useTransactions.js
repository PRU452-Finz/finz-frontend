import { useState, useMemo, useCallback } from 'react';
import { useFinance } from '../context/FinanceContext';

/**
 * Hook to manage transactions with filtering and sorting
 */
export default function useTransactions() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.category !== 'all' && t.category !== filters.category) {
        return false;
      }
      if (filters.dateFrom && new Date(t.date) < new Date(filters.dateFrom)) {
        return false;
      }
      if (filters.dateTo && new Date(t.date) > new Date(filters.dateTo)) {
        return false;
      }
      return true;
    });
  }, [transactions, filters]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'nominal':
          comparison = a.nominal - b.nominal;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredTransactions, sortBy, sortOrder]);

  const totalFiltered = useMemo(() => {
    return filteredTransactions.reduce((sum, t) => sum + t.nominal, 0);
  }, [filteredTransactions]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ search: '', category: 'all', dateFrom: '', dateTo: '' });
  }, []);

  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.dateFrom || filters.dateTo;

  return {
    transactions: sortedTransactions,
    totalFiltered,
    filteredCount: filteredTransactions.length,
    filters,
    updateFilter,
    clearFilters,
    hasActiveFilters,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
