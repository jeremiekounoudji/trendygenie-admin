// Services hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { Service, ServiceStats, ServiceFilters, ServiceQueryParams, ServiceStatus } from '../types/service';
import type { PaginationState, ApiError } from '../types/common';
import * as serviceService from '../services/serviceService';

export interface UseServicesReturn {
  services: Service[];
  loading: boolean;
  error: ApiError | null;
  stats: ServiceStats | null;
  statsLoading: boolean;
  pagination: PaginationState;
  filters: ServiceFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setFilters: (filters: ServiceFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  updateStatus: (id: string, status: ServiceStatus) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  refetch: () => void;
  refetchStats: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing services data
 */
export function useServices(): UseServicesReturn {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [stats, setStats] = useState<ServiceStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFiltersState] = useState<ServiceFilters>({});
  const [sortBy, setSortByState] = useState('created_at');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: ServiceQueryParams = {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
    };

    const { data, error: fetchError } = await serviceService.getServices(params);

    if (fetchError) {
      setError(fetchError);
      setLoading(false);
      return;
    }

    if (data) {
      setServices(data.data);
      setPagination({
        page: data.page,
        pageSize: data.pageSize,
        total: data.total,
        totalPages: data.totalPages,
      });
    }

    setLoading(false);
  }, [filters, pagination.page, pagination.pageSize, sortBy, sortOrder]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    const { stats: fetchedStats } = await serviceService.getServiceStats();
    if (fetchedStats) setStats(fetchedStats);
    setStatsLoading(false);
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);
  useEffect(() => { fetchStats(); }, [fetchStats]);

  const setFilters = useCallback((newFilters: ServiceFilters) => {
    setFiltersState(newFilters);
    setPagination(prev => ({ ...prev, page: 1 }));
  }, []);

  const setPage = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setPagination(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  const setSortBy = useCallback((newSortBy: string) => setSortByState(newSortBy), []);
  const setSortOrder = useCallback((newSortOrder: 'asc' | 'desc') => setSortOrderState(newSortOrder), []);

  const updateStatus = useCallback(async (id: string, status: ServiceStatus): Promise<boolean> => {
    const { service: updated, error: err } = await serviceService.updateServiceStatus(id, status);
    if (err) { setError(err); return false; }
    if (updated) {
      setServices(prev => prev.map(s => s.id === id ? updated : s));
      fetchStats();
    }
    return true;
  }, [fetchStats]);

  const deleteService = useCallback(async (id: string): Promise<boolean> => {
    const { error: err } = await serviceService.deleteService(id);
    if (err) { setError(err); return false; }
    setServices(prev => prev.filter(s => s.id !== id));
    fetchStats();
    if (services.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchServices();
    }
    return true;
  }, [fetchStats, fetchServices, services.length, pagination.page]);

  return {
    services, loading, error, stats, statsLoading, pagination, filters,
    sortBy, sortOrder,
    setFilters, setPage, setPageSize, setSortBy, setSortOrder,
    updateStatus, deleteService, refetch: fetchServices, refetchStats: fetchStats,
  };
}

export default useServices;
