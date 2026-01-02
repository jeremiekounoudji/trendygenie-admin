// Transaction service for admin panel
import { supabase } from './supabase';
import type { Transaction, TransactionStats, TransactionQueryParams } from '../types/transaction';
import type { PaginatedResponse, ApiError } from '../types/common';

const DEFAULT_PAGE_SIZE = 10;

export interface TransactionResponse {
  transaction: Transaction | null;
  error: ApiError | null;
}

export interface TransactionsResponse {
  data: PaginatedResponse<Transaction> | null;
  error: ApiError | null;
}

export interface TransactionStatsResponse {
  stats: TransactionStats | null;
  error: ApiError | null;
}

/**
 * Get paginated list of transactions with filtering and search
 */
export async function getTransactions(params: TransactionQueryParams = {}): Promise<TransactionsResponse> {
  try {
    const {
      page = 1,
      pageSize = DEFAULT_PAGE_SIZE,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      paymentProvider,
      dateFrom,
      dateTo,
      search,
    } = params;

    const offset = (page - 1) * pageSize;

    // Build query with joined data
    let query = supabase
      .from('payments')
      .select(`
        *,
        customer:users!customer_id(*),
        business:businesses!business_id(*),
        order:orders!order_id(*)
      `, { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (paymentProvider) {
      query = query.eq('payment_provider', paymentProvider);
    }

    if (dateFrom) {
      query = query.gte('created_at', dateFrom);
    }

    if (dateTo) {
      query = query.lte('created_at', dateTo);
    }

    if (search) {
      // Search by order_id or customer name (via subquery would be complex, so we search transaction fields)
      query = query.or(`order_id.ilike.%${search}%,description.ilike.%${search}%,provider_payment_id.ilike.%${search}%`);
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
        data: data as Transaction[],
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
      error: { message: err instanceof Error ? err.message : 'Failed to fetch transactions' },
    };
  }
}

/**
 * Get a single transaction by ID with joined data
 */
export async function getTransactionById(id: string): Promise<TransactionResponse> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        customer:users!customer_id(*),
        business:businesses!business_id(*),
        order:orders!order_id(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return {
        transaction: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      transaction: data as Transaction,
      error: null,
    };
  } catch (err) {
    return {
      transaction: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch transaction' },
    };
  }
}

/**
 * Get transaction statistics including total revenue
 */
export async function getTransactionStats(): Promise<TransactionStatsResponse> {
  try {
    // Get total count
    const { count: total, error: totalError } = await supabase
      .from('payments')
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
      .from('payments')
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

    const { count: completed, error: completedError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (completedError) {
      return {
        stats: null,
        error: {
          message: completedError.message,
          code: completedError.code,
        },
      };
    }

    const { count: failed, error: failedError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'failed');

    if (failedError) {
      return {
        stats: null,
        error: {
          message: failedError.message,
          code: failedError.code,
        },
      };
    }

    const { count: refunded, error: refundedError } = await supabase
      .from('payments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'refunded');

    if (refundedError) {
      return {
        stats: null,
        error: {
          message: refundedError.message,
          code: refundedError.code,
        },
      };
    }

    // Calculate total revenue from completed transactions
    const { data: revenueData, error: revenueError } = await supabase
      .from('payments')
      .select('amount')
      .eq('status', 'completed');

    if (revenueError) {
      return {
        stats: null,
        error: {
          message: revenueError.message,
          code: revenueError.code,
        },
      };
    }

    const totalRevenue = revenueData?.reduce((sum: number, t: { amount: number | null }) => sum + (t.amount || 0), 0) ?? 0;

    return {
      stats: {
        total: total ?? 0,
        totalRevenue,
        pending: pending ?? 0,
        completed: completed ?? 0,
        failed: failed ?? 0,
        refunded: refunded ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return {
      stats: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch transaction stats' },
    };
  }
}

/**
 * Get transactions by date range for reporting
 */
export async function getTransactionsByDateRange(
  dateFrom: string,
  dateTo: string
): Promise<TransactionsResponse> {
  return getTransactions({
    dateFrom,
    dateTo,
    pageSize: 1000, // Get all transactions in range
  });
}

/**
 * Get revenue by payment provider
 */
export async function getRevenueByProvider(): Promise<{
  data: { provider: string; revenue: number; count: number }[] | null;
  error: ApiError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('payment_provider, amount')
      .eq('status', 'completed');

    if (error) {
      return {
        data: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    // Aggregate by provider
    const providerMap = new Map<string, { revenue: number; count: number }>();
    
    data?.forEach((t: { payment_provider: string | null; amount: number | null }) => {
      const provider = t.payment_provider || 'unknown';
      const existing = providerMap.get(provider) || { revenue: 0, count: 0 };
      providerMap.set(provider, {
        revenue: existing.revenue + (t.amount || 0),
        count: existing.count + 1,
      });
    });

    const result = Array.from(providerMap.entries()).map(([provider, stats]) => ({
      provider,
      ...stats,
    }));

    return {
      data: result,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch revenue by provider' },
    };
  }
}
