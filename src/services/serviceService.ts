// Service service for admin panel (manages service listings)
import { supabase } from './supabase';
import type { Service, ServiceStats, ServiceStatus, ServiceQueryParams } from '../types/service';
import type { PaginatedResponse, ApiError } from '../types/common';

const DEFAULT_PAGE_SIZE = 10;

export interface ServiceResponse {
  service: Service | null;
  error: ApiError | null;
}

export interface ServicesResponse {
  data: PaginatedResponse<Service> | null;
  error: ApiError | null;
}

export interface ServiceStatsResponse {
  stats: ServiceStats | null;
  error: ApiError | null;
}

/**
 * Get paginated list of services with filtering and search
 */
export async function getServices(params: ServiceQueryParams = {}): Promise<ServicesResponse> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      categoryId,
      businessId,
      search,
    } = params;

    const offset = (page - 1) * pageSize;

    // Build query with joined data
    let query = supabase
      .from('services')
      .select(`
        *,
        business:businesses!business_id(*),
        category:categories!category_id(*),
        provider:users!provider_id(*)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    if (businessId) {
      query = query.eq('business_id', businessId);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
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
        data: data as Service[],
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
      error: { message: err instanceof Error ? err.message : 'Failed to fetch services' },
    };
  }
}

/**
 * Get a single service by ID with joined data
 */
export async function getServiceById(id: string): Promise<ServiceResponse> {
  try {
    const { data, error } = await supabase
      .from('services')
      .select(`
        *,
        business:businesses!business_id(*),
        category:categories!category_id(*),
        provider:users!provider_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return {
        service: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      service: data as Service,
      error: null,
    };
  } catch (err) {
    return {
      service: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch service' },
    };
  }
}

/**
 * Update service status
 */
export async function updateServiceStatus(id: string, status: ServiceStatus): Promise<ServiceResponse> {
  try {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    // Update is_active based on status
    if (status === 'active') {
      updateData.is_active = true;
    } else if (status === 'suspended' || status === 'rejected' || status === 'deleted') {
      updateData.is_active = false;
    }

    const { data, error } = await supabase
      .from('services')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        business:businesses!business_id(*),
        category:categories!category_id(*),
        provider:users!provider_id(*)
      `)
      .single();

    if (error) {
      return {
        service: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      service: data as Service,
      error: null,
    };
  } catch (err) {
    return {
      service: null,
      error: { message: err instanceof Error ? err.message : 'Failed to update service status' },
    };
  }
}

/**
 * Delete a service by ID
 */
export async function deleteService(id: string): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase
      .from('services')
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
      error: { message: err instanceof Error ? err.message : 'Failed to delete service' },
    };
  }
}

/**
 * Get service statistics
 */
export async function getServiceStats(): Promise<ServiceStatsResponse> {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('services')
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
      .from('services')
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
      .from('services')
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
      .from('services')
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
      .from('services')
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

    const { count: requestDeletion, error: requestDeletionError } = await supabase
      .from('services')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'requestDeletion');

    if (requestDeletionError) {
      return {
        stats: null,
        error: {
          message: requestDeletionError.message,
          code: requestDeletionError.code,
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
        requestDeletion: requestDeletion ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return {
      stats: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch service stats' },
    };
  }
}
