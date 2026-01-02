// Transactions hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { Transaction, TransactionStats, TransactionFilters, TransactionQueryParams } from '../types/transaction';
import type { PaginationState, ApiError } from '../types/common';
import * as transactionService from '../services/transactionService';

export interface UseTransactionsReturn {
  transactions: Transaction[];
  loading: boolean;
  error: ApiError | null;
  stats: TransactionStats | null;
  statsLoading: boolean;
  pagination: PaginationState;
  filters: TransactionFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setFilters: (filters: TransactionFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  getTransactionById: (id: string) => Promise<Transaction | null>;
  refetch: () => void;
  refetchStats: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing transactions data
 * Handles fetching, filtering, pagination (view-only, no mutations)
 */
export function useTransactions(): UseTransactionsReturn {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [stats, setStats] = useState<TransactionStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFiltersState] = useState<TransactionFilters>({});
  const [sortBy, setSortByState] = useState('created_at');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');

  // Fetch transactions
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: TransactionQueryParams = {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
    };

    const { data, error: fetchError } = await transactionService.getTransactions(params);

    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }

    if (data) {
      setTransactions(data.data);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    }

    setLoading(false);
  }, [filters, pagination.page, pagination.pageSize, sortBy, sortOrder]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);

    const { stats: fetchedStats, error: statsError } = await transactionService.getTransactionStats();

    if (!statsError && fetchedStats) {
      setStats(fetchedStats);
    }

    setStatsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Set filters and reset to page 1
  const setFilters = useCallback((newFilters: TransactionFilters) => {
    setFiltersState(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  // Set page
  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  // Set page size and reset to page 1
  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  // Set sort by
  const setSortBy = useCallback((newSortBy: string) => {
    setSortByState(newSortBy);
  }, []);

  // Set sort order
  const setSortOrder = useCallback((newSortOrder: 'asc' | 'desc') => {
    setSortOrderState(newSortOrder);
  }, []);

  // Get transaction by ID
  const getTransactionById = useCallback(async (id: string): Promise<Transaction | null> => {
    const { transaction, error: fetchError } = await transactionService.getTransactionById(id);

    if (fetchError) {
      setError(fetchError);
      return null;
    }

    return transaction;
  }, []);

  return {
    transactions,
    loading,
    error,
    stats,
    statsLoading,
    pagination,
    filters,
    sortBy,
    sortOrder,
    setFilters,
    setPage,
    setPageSize,
    setSortBy,
    setSortOrder,
    getTransactionById,
    refetch: fetchTransactions,
    refetchStats: fetchStats,
  };
}

export default useTransactions;
