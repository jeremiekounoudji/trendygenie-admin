// Legal pages hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { LegalPage, CreateLegalPageInput, UpdateLegalPageInput, LegalPageFilters } from '../types/legalPage';
import type { ApiError } from '../types/common';
import * as legalPageService from '../services/legalPageService';
import { toastHelpers } from '../utils/toast';

export interface UseLegalPagesReturn {
  legalPages: LegalPage[];
  loading: boolean;
  error: ApiError | null;
  filters: LegalPageFilters;
  setFilters: (filters: LegalPageFilters) => void;
  createLegalPage: (input: CreateLegalPageInput) => Promise<LegalPage | null>;
  updateLegalPage: (id: string, input: UpdateLegalPageInput) => Promise<LegalPage | null>;
  deleteLegalPage: (id: string) => Promise<boolean>;
  getLegalPageById: (id: string) => Promise<LegalPage | null>;
  refetch: () => void;
}

/**
 * Custom hook for managing legal pages data
 * Handles fetching, filtering, and CRUD operations
 */
export function useLegalPages(): UseLegalPagesReturn {
  const [legalPages, setLegalPages] = useState<LegalPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const [filters, setFiltersState] = useState<LegalPageFilters>({});

  // Fetch legal pages
  const fetchLegalPages = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { legalPages: fetchedPages, error: fetchError } = await legalPageService.getLegalPages(filters);

    if (fetchError) {
      setError(fetchError);
      toastHelpers.crudError.load('legal pages');
      setLoading(false);
      return;
    }

    if (fetchedPages) {
      setLegalPages(fetchedPages);
    }

    setLoading(false);
  }, [filters]);

  // Initial fetch
  useEffect(() => {
    fetchLegalPages();
  }, [fetchLegalPages]);

  // Set filters
  const setFilters = useCallback((newFilters: LegalPageFilters) => {
    setFiltersState(newFilters);
  }, []);

  // Get legal page by ID
  const getLegalPageById = useCallback(async (id: string): Promise<LegalPage | null> => {
    const { legalPage, error: fetchError } = await legalPageService.getLegalPageById(id);

    if (fetchError) {
      setError(fetchError);
      return null;
    }

    return legalPage;
  }, []);

  // Create legal page
  const createLegalPage = useCallback(async (input: CreateLegalPageInput): Promise<LegalPage | null> => {
    const { legalPage, error: createError } = await legalPageService.createLegalPage(input);

    if (createError) {
      setError(createError);
      toastHelpers.crudError.create('legal page');
      return null;
    }

    if (legalPage) {
      // Add to local state
      setLegalPages(prev => [legalPage, ...prev]);
      toastHelpers.crud.created('Legal page');
    }

    return legalPage;
  }, []);

  // Update legal page
  const updateLegalPage = useCallback(async (id: string, input: UpdateLegalPageInput): Promise<LegalPage | null> => {
    const { legalPage, error: updateError } = await legalPageService.updateLegalPage(id, input);

    if (updateError) {
      setError(updateError);
      toastHelpers.crudError.update('legal page');
      return null;
    }

    if (legalPage) {
      // Update local state
      setLegalPages(prev => prev.map(p => p.id === id ? legalPage : p));
      toastHelpers.crud.updated('Legal page');
    }

    return legalPage;
  }, []);

  // Delete legal page
  const deleteLegalPage = useCallback(async (id: string): Promise<boolean> => {
    const { error: deleteError } = await legalPageService.deleteLegalPage(id);

    if (deleteError) {
      setError(deleteError);
      toastHelpers.crudError.delete('legal page');
      return false;
    }

    // Remove from local state
    setLegalPages(prev => prev.filter(p => p.id !== id));
    toastHelpers.crud.deleted('Legal page');

    return true;
  }, []);

  return {
    legalPages,
    loading,
    error,
    filters,
    setFilters,
    createLegalPage,
    updateLegalPage,
    deleteLegalPage,
    getLegalPageById,
    refetch: fetchLegalPages,
  };
}

export default useLegalPages;
