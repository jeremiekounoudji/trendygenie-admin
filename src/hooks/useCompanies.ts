// Companies hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { Company, CompanyStats, CompanyFilters, CompanyQueryParams, CompanyStatus } from '../types/company';
import type { PaginationState, ApiError } from '../types/common';
import * as companyService from '../services/companyService';

export interface UseCompaniesReturn {
  companies: Company[];
  loading: boolean;
  error: ApiError | null;
  stats: CompanyStats | null;
  statsLoading: boolean;
  pagination: PaginationState;
  filters: CompanyFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setFilters: (filters: CompanyFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  updateStatus: (id: string, status: CompanyStatus) => Promise<boolean>;
  deleteCompany: (id: string) => Promise<boolean>;
  refetch: () => void;
  refetchStats: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing companies data
 * Handles fetching, filtering, pagination, and mutations
 */
export function useCompanies(): UseCompaniesReturn {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFiltersState] = useState<CompanyFilters>({});
  const [sortBy, setSortByState] = useState('created_at');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');

  // Fetch companies
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: CompanyQueryParams = {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
    };

    const { data, error: fetchError } = await companyService.getCompanies(params);

    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }

    if (data) {
      setCompanies(data.data);
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

    const { stats: fetchedStats, error: statsError } = await companyService.getCompanyStats();

    if (!statsError && fetchedStats) {
      setStats(fetchedStats);
    }

    setStatsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Set filters and reset to page 1
  const setFilters = useCallback((newFilters: CompanyFilters) => {
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

  // Update company status
  const updateStatus = useCallback(async (id: string, status: CompanyStatus): Promise<boolean> => {
    const { company: updatedCompany, error: updateError } = await companyService.updateCompanyStatus(id, status);

    if (updateError) {
      setError(updateError);
      return false;
    }

    if (updatedCompany) {
      // Update local state
      setCompanies(prev => prev.map(c => c.id === id ? updatedCompany : c));
      // Refetch stats
      fetchStats();
    }

    return true;
  }, [fetchStats]);

  // Delete company
  const deleteCompany = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await companyService.deleteCompany(id);

    if (deleteError) {
      setError(deleteError);
      return false;
    }

    // Remove from local state
    setCompanies(prev => prev.filter(c => c.id !== id));
    // Refetch stats
    fetchStats();
    // Refetch if page is now empty
    if (companies.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchCompanies();
    }

    return true;
  }, [fetchStats, fetchCompanies, companies.length, pagination.page]);

  return {
    companies,
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
    deleteCompany,
    refetch: fetchCompanies,
    refetchStats: fetchStats,
  };
}

export default useCompanies;
