// Business service for admin panel
import { supabase } from './supabase';
import type { Business, BusinessStats, BusinessStatus, BusinessQueryParams } from '../types/business';
import type { PaginatedResponse, ApiError } from '../types/common';

const DEFAULT_PAGE_SIZE = 10;

export interface BusinessResponse {
  business: Business | null;
  error: ApiError | null;
}

export interface BusinessesResponse {
  data: PaginatedResponse<Business> | null;
  error: ApiError | null;
}

export interface BusinessStatsResponse {
  stats: BusinessStats | null;
  error: ApiError | null;
}

/**
 * Get paginated list of businesses with filtering and search
 */
export async function getBusinesses(params: BusinessQueryParams = {}): Promise<BusinessesResponse> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      categoryId,
      companyId,
      search,
    } = params;

    const offset = (page - 1) * pageSize;

    // Build query with joined data
    let query = supabase
      .from('businesses')
      .select(`
        *,
        company:companies!company_id(*),
        category:categories!category_id(*),
        subcategory:subcategories!subcategory_id(*)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (companyId) {
      query = query.eq('company_id', companyId);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%,contact_email.ilike.%${search}%`);
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
        data: data as Business[],
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
      error: { message: err instanceof Error ? err.message : 'Failed to fetch businesses' },
    };
  }
}

/**
 * Get a single business by ID with joined data
 */
export async function getBusinessById(id: string): Promise<BusinessResponse> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .select(`
        *,
        company:companies!company_id(*),
        category:categories!category_id(*),
        subcategory:subcategories!subcategory_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return {
        business: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      business: data as Business,
      error: null,
    };
  } catch (err) {
    return {
      business: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch business' },
    };
  }
}

/**
 * Update business status
 */
export async function updateBusinessStatus(id: string, status: BusinessStatus): Promise<BusinessResponse> {
  try {
    const { data, error } = await supabase
      .from('businesses')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(`
        *,
        company:companies!company_id(*),
        category:categories!category_id(*),
        subcategory:subcategories!subcategory_id(*)
      `)
      .single();

    if (error) {
      return {
        business: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      business: data as Business,
      error: null,
    };
  } catch (err) {
    return {
      business: null,
      error: { message: err instanceof Error ? err.message : 'Failed to update business status' },
    };
  }
}

/**
 * Delete a business by ID
 */
export async function deleteBusiness(id: string): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase
      .from('businesses')
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
      error: { message: err instanceof Error ? err.message : 'Failed to delete business' },
    };
  }
}

/**
 * Get business statistics
 */
export async function getBusinessStats(): Promise<BusinessStatsResponse> {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('businesses')
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
    const { count: active, error: activeError } = await supabase
      .from('businesses')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (activeError) {
      return {
        stats: null,
        error: {
          message: activeError.message,
          code: activeError.code,
        },
      };
    }

    const { count: pending, error: pendingError } = await supabase
      .from('businesses')
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

    const { count: suspended, error: suspendedError } = await supabase
      .from('businesses')
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

    const { count: rejected, error: rejectedError } = await supabase
      .from('businesses')
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

    return {
      stats: {
        total: total ?? 0,
        active: active ?? 0,
        pending: pending ?? 0,
        suspended: suspended ?? 0,
        rejected: rejected ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return {
      stats: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch business stats' },
    };
  }
}
