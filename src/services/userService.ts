// User service for admin panel
import { supabase } from './supabase';
import type { User, UserStats, UserQueryParams } from '../types/user';
import type { PaginatedResponse, ApiError } from '../types/common';

const DEFAULT_PAGE_SIZE = 10;

export interface UserResponse {
  user: User | null;
  error: ApiError | null;
}

export interface UsersResponse {
  data: PaginatedResponse<User> | null;
  error: ApiError | null;
}

export interface UserStatsResponse {
  stats: UserStats | null;
  error: ApiError | null;
}

/**
 * Get paginated list of users with filtering and search
 */
export async function getUsers(params: UserQueryParams = {}): Promise<UsersResponse> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sortBy = 'created_at',
      sortOrder = 'desc',
      userType,
      isActive,
      search,
    } = params;

    // Calculate offset
    const offset = (page - 1) * pageSize;

    // Build query
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    // Apply filters
    if (userType) {
      query = query.eq('user_type', userType);
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    if (search) {
      query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
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
        data: data as User[],
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
      error: { message: err instanceof Error ? err.message : 'Failed to fetch users' },
    };
  }
}

/**
 * Get a single user by ID
 */
export async function getUserById(id: string): Promise<UserResponse> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        user: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      user: data as User,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch user' },
    };
  }
}

/**
 * Update user's active status
 */
export async function updateUserStatus(id: string, isActive: boolean): Promise<UserResponse> {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        user: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      user: data as User,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: { message: err instanceof Error ? err.message : 'Failed to update user status' },
    };
  }
}

/**
 * Delete a user by ID
 */
export async function deleteUser(id: string): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase
      .from('users')
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
      error: { message: err instanceof Error ? err.message : 'Failed to delete user' },
    };
  }
}

/**
 * Get user statistics
 */
export async function getUserStats(): Promise<UserStatsResponse> {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('users')
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

    // Get active count
    const { count: active, error: activeError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (activeError) {
      return {
        stats: null,
        error: {
          message: activeError.message,
          code: activeError.code,
        },
      };
    }

    // Get counts by user type
    const { count: customers, error: customersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'customer');

    if (customersError) {
      return {
        stats: null,
        error: {
          message: customersError.message,
          code: customersError.code,
        },
      };
    }

    const { count: providers, error: providersError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'provider');

    if (providersError) {
      return {
        stats: null,
        error: {
          message: providersError.message,
          code: providersError.code,
        },
      };
    }

    const { count: admins, error: adminsError } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'admin');

    if (adminsError) {
      return {
        stats: null,
        error: {
          message: adminsError.message,
          code: adminsError.code,
        },
      };
    }

    return {
      stats: {
        total: total ?? 0,
        active: active ?? 0,
        inactive: (total ?? 0) - (active ?? 0),
        customers: customers ?? 0,
        providers: providers ?? 0,
        admins: admins ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return {
      stats: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch user stats' },
    };
  }
}
