// Company service for admin panel
import { supabase } from './supabase';
import type { Company, CompanyStats, CompanyStatus, CompanyQueryParams } from '../types/company';
import type { PaginatedResponse, ApiError } from '../types/common';

const DEFAULT_PAGE_SIZE = 10;

export interface CompanyResponse {
  company: Company | null;
  error: ApiError | null;
}

export interface CompaniesResponse {
  data: PaginatedResponse<Company> | null;
  error: ApiError | null;
}

export interface CompanyStatsResponse {
  stats: CompanyStats | null;
  error: ApiError | null;
}

/**
 * Get paginated list of companies with filtering and search
 */
export async function getCompanies(params: CompanyQueryParams = {}): Promise<CompaniesResponse> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      categoryId,
      search,
    } = params;

    const offset = (page - 1) * pageSize;

    // Build query with joined data
    let query = supabase
      .from('companies')
      .select(`
        *,
        owner:users!owner_id(*),
        category:categories!category_id(*)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,registration_number.ilike.%${search}%,email.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + pageSize - 1);

    const { data, error, count } = await query;

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    const total = count ?? 0;
    const totalPages = Math.ceil(total / pageSize);

    return {
      data: {
        data: data as Company[],
        total,
        page,
        pageSize,
        totalPages,
      },
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch companies' },
    };
  }
}

/**
 * Get a single company by ID with joined data
 */
export async function getCompanyById(id: string): Promise<CompanyResponse> {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        owner:users!owner_id(*),
        category:categories!category_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return {
        company: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      company: data as Company,
      error: null,
    };
  } catch (err) {
    return {
      company: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch company' },
    };
  }
}

/**
 * Update company status
 * Sets approved_at timestamp when status changes to 'approved'
 */
export async function updateCompanyStatus(id: string, status: CompanyStatus): Promise<CompanyResponse> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Set approved_at when approving
    if (status === 'approved') {
      updateData.approved_at = new Date().toISOString();
      updateData.is_verified = true;
    }

    // Clear approved_at if rejecting or suspending
    if (status === 'rejected' || status === 'suspended') {
      updateData.is_verified = false;
    }

    const { data, error } = await supabase
      .from('companies')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        owner:users!owner_id(*),
        category:categories!category_id(*)
      `)
      .single();

    if (error) {
      return {
        company: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      company: data as Company,
      error: null,
    };
  } catch (err) {
    return {
      company: null,
      error: { message: err instanceof Error ? err.message : 'Failed to update company status' },
    };
  }
}

/**
 * Delete a company by ID
 */
export async function deleteCompany(id: string): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase
      .from('companies')
      .delete()
      .eq('id', id);

    if (error) {
      return {
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return { error: null };
  } catch (err) {
    return {
      error: { message: err instanceof Error ? err.message : 'Failed to delete company' },
    };
  }
}

/**
 * Get company statistics
 */
export async function getCompanyStats(): Promise<CompanyStatsResponse> {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });

    if (totalError) {
      return {
        stats: null,
        error: {
          message: totalError.message,
          code: totalError.code,
        },
      };
    }

    // Get counts by status
    const { count: pending, error: pendingError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingError) {
      return {
        stats: null,
        error: {
          message: pendingError.message,
          code: pendingError.code,
        },
      };
    }

    const { count: approved, error: approvedError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (approvedError) {
      return {
        stats: null,
        error: {
          message: approvedError.message,
          code: approvedError.code,
        },
      };
    }

    const { count: rejected, error: rejectedError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected');

    if (rejectedError) {
      return {
        stats: null,
        error: {
          message: rejectedError.message,
          code: rejectedError.code,
        },
      };
    }

    const { count: suspended, error: suspendedError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'suspended');

    if (suspendedError) {
      return {
        stats: null,
        error: {
          message: suspendedError.message,
          code: suspendedError.code,
        },
      };
    }

    return {
      stats: {
        total: total ?? 0,
        pending: pending ?? 0,
        approved: approved ?? 0,
        rejected: rejected ?? 0,
        suspended: suspended ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return {
      stats: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch company stats' },
    };
  }
}
