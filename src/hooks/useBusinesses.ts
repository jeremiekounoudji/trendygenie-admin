// Businesses hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { Business, BusinessStats, BusinessFilters, BusinessQueryParams, BusinessStatus } from '../types/business';
import type { PaginationState, ApiError } from '../types/common';
import * as businessService from '../services/businessService';

export interface UseBusinessesReturn {
  businesses: Business[];
  loading: boolean;
  error: ApiError | null;
  stats: BusinessStats | null;
  statsLoading: boolean;
  pagination: PaginationState;
  filters: BusinessFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setFilters: (filters: BusinessFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  updateStatus: (id: string, status: BusinessStatus) => Promise<boolean>;
  deleteBusiness: (id: string) => Promise<boolean>;
  refetch: () => void;
  refetchStats: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing businesses data
 * Handles fetching, filtering, pagination, and mutations
 */
export function useBusinesses(): UseBusinessesReturn {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [stats, setStats] = useState<BusinessStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFiltersState] = useState<BusinessFilters>({});
  const [sortBy, setSortByState] = useState('created_at');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');

  // Fetch businesses
  const fetchBusinesses = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: BusinessQueryParams = {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
    };

    const { data, error: fetchError } = await businessService.getBusinesses(params);

    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }

    if (data) {
      setBusinesses(data.data);
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

    const { stats: fetchedStats, error: statsError } = await businessService.getBusinessStats();

    if (!statsError && fetchedStats) {
      setStats(fetchedStats);
    }

    setStatsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Set filters and reset to page 1
  const setFilters = useCallback((newFilters: BusinessFilters) => {
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

  // Update business status
  const updateStatus = useCallback(async (id: string, status: BusinessStatus): Promise<boolean> => {
    const { business: updatedBusiness, error: updateError } = await businessService.updateBusinessStatus(id, status);

    if (updateError) {
      setError(updateError);
      return false;
    }

    if (updatedBusiness) {
      // Update local state
      setBusinesses(prev => prev.map(b => b.id === id ? updatedBusiness : b));
      // Refetch stats
      fetchStats();
    }

    return true;
  }, [fetchStats]);

  // Delete business
  const deleteBusiness = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await businessService.deleteBusiness(id);

    if (deleteError) {
      setError(deleteError);
      return false;
    }

    // Remove from local state
    setBusinesses(prev => prev.filter(b => b.id !== id));
    // Refetch stats
    fetchStats();
    // Refetch if page is now empty
    if (businesses.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchBusinesses();
    }

    return true;
  }, [fetchStats, fetchBusinesses, businesses.length, pagination.page]);

  return {
    businesses,
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
    updateStatus,
    deleteBusiness,
    refetch: fetchBusinesses,
    refetchStats: fetchStats,
  };
}

export default useBusinesses;
