// Users hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { User, UserStats, UserFilters, UserQueryParams } from '../types/user';
import type { PaginationState, ApiError } from '../types/common';
import * as userService from '../services/userService';
import { toastHelpers } from '../utils/toast';

export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: ApiError | null;
  stats: UserStats | null;
  statsLoading: boolean;
  pagination: PaginationState;
  filters: UserFilters;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  setFilters: (filters: UserFilters) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: 'asc' | 'desc') => void;
  updateStatus: (id: string, isActive: boolean) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  refetch: () => void;
  refetchStats: () => void;
}

const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for managing users data
 * Handles fetching, filtering, pagination, and mutations
 */
export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    totalPages: 0,
  });
  
  const [filters, setFiltersState] = useState<UserFilters>({});
  const [sortBy, setSortByState] = useState('created_at');
  const [sortOrder, setSortOrderState] = useState<'asc' | 'desc'>('desc');

  // Fetch users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    const params: UserQueryParams = {
      ...filters,
      page: pagination.page,
      pageSize: pagination.pageSize,
      sortBy,
      sortOrder,
    };

    const { data, error: fetchError } = await userService.getUsers(params);

    if (fetchError) {
      setError(fetchError);
      toastHelpers.crudError.load('users');
      setLoading(false);
      return;
    }

    if (data) {
      setUsers(data.data);
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

    const { stats: fetchedStats, error: statsError } = await userService.getUserStats();

    if (!statsError && fetchedStats) {
      setStats(fetchedStats);
    }

    setStatsLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Set filters and reset to page 1
  const setFilters = useCallback((newFilters: UserFilters) => {
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

  // Update user status
  const updateStatus = useCallback(async (id: string, isActive: boolean): Promise<boolean> => {
    const { user: updatedUser, error: updateError } = await userService.updateUserStatus(id, isActive);

    if (updateError) {
      setError(updateError);
      toastHelpers.crudError.update('user');
      return false;
    }

    if (updatedUser) {
      // Update local state
      setUsers(prev => prev.map(u => u.id === id ? updatedUser : u));
      // Refetch stats
      fetchStats();
      toastHelpers.crud.statusUpdated('User');
    }

    return true;
  }, [fetchStats]);

  // Delete user
  const deleteUser = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await userService.deleteUser(id);

    if (deleteError) {
      setError(deleteError);
      toastHelpers.crudError.delete('user');
      return false;
    }

    // Remove from local state
    setUsers(prev => prev.filter(u => u.id !== id));
    // Refetch stats
    fetchStats();
    // Refetch if page is now empty
    if (users.length === 1 && pagination.page > 1) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    } else {
      fetchUsers();
    }

    toastHelpers.crud.deleted('User');
    return true;
  }, [fetchStats, fetchUsers, users.length, pagination.page]);

  return {
    users,
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
    deleteUser,
    refetch: fetchUsers,
    refetchStats: fetchStats,
  };
}

export default useUsers;
