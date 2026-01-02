// Pagination hook for admin panel
import { useState, useCallback, useMemo } from 'react';
import type { PaginationState } from '../types/common';

export interface UsePaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total?: number;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  setTotal: (total: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  resetPagination: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  pageNumbers: number[];
  offset: number;
}

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

/**
 * Custom hook for pagination state management
 * Provides pagination controls and computed values
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const {
    initialPage = DEFAULT_PAGE,
    initialPageSize = DEFAULT_PAGE_SIZE,
    total: initialTotal = 0,
  } = options;

  const [page, setPageState] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);
  const [total, setTotalState] = useState(initialTotal);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / pageSize));
  }, [total, pageSize]);

  // Calculate offset for database queries
  const offset = useMemo(() => {
    return (page - 1) * pageSize;
  }, [page, pageSize]);

  // Navigation flags
  const canGoNext = page < totalPages;
  const canGoPrev = page > 1;

  // Generate page numbers for pagination UI
  const pageNumbers = useMemo(() => {
    const maxVisiblePages = 5;
    const pages: number[] = [];
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      let start = Math.max(1, page - Math.floor(maxVisiblePages / 2));
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      // Adjust start if we're near the end
      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [page, totalPages]);

  // Set page with bounds checking
  const setPage = useCallback((newPage: number) => {
    const boundedPage = Math.max(1, Math.min(newPage, totalPages));
    setPageState(boundedPage);
  }, [totalPages]);

  // Set page size and reset to page 1
  const setPageSize = useCallback((newPageSize: number) => {
    setPageSizeState(newPageSize);
    setPageState(1); // Reset to first page when page size changes
  }, []);

  // Set total count
  const setTotal = useCallback((newTotal: number) => {
    setTotalState(newTotal);
    // Adjust current page if it's now out of bounds
    const newTotalPages = Math.max(1, Math.ceil(newTotal / pageSize));
    if (page > newTotalPages) {
      setPageState(newTotalPages);
    }
  }, [page, pageSize]);

  // Navigation helpers
  const nextPage = useCallback(() => {
    if (canGoNext) {
      setPageState(prev => prev + 1);
    }
  }, [canGoNext]);

  const prevPage = useCallback(() => {
    if (canGoPrev) {
      setPageState(prev => prev - 1);
    }
  }, [canGoPrev]);

  const firstPage = useCallback(() => {
    setPageState(1);
  }, []);

  const lastPage = useCallback(() => {
    setPageState(totalPages);
  }, [totalPages]);

  // Reset pagination to initial state
  const resetPagination = useCallback(() => {
    setPageState(initialPage);
    setPageSizeState(initialPageSize);
  }, [initialPage, initialPageSize]);

  // Build pagination state object
  const pagination: PaginationState = useMemo(() => ({
    page,
    pageSize,
    total,
    totalPages,
  }), [page, pageSize, total, totalPages]);

  return {
    pagination,
    setPage,
    setPageSize,
    setTotal,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    resetPagination,
    canGoNext,
    canGoPrev,
    pageNumbers,
    offset,
  };
}

export default usePagination;
