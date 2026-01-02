// Transaction types for admin panel

import type { User } from './user';
import type { Business } from './business';

export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled' | 'processing';

export type PaymentProvider = 'stripe' | 'paypal' | 'cash' | 'bank_transfer' | 'square' | 'razorpay' | 'flutterwave' | 'mpesa' | 'google_pay' | 'apple_pay';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  business_id: string | null;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  order_id: string;
  customer_id: string;
  business_id: string | null;
  company_id: string | null;
  amount: number;
  currency: string;
  payment_method: string;
  payment_provider: PaymentProvider;
  provider_payment_id: string | null;
  status: TransactionStatus;
  transaction_fee: number;
  description: string | null;
  receipt_url: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined data
  customer?: User;
  order?: Order;
  business?: Business;
}

export interface TransactionStats {
  total: number;
  totalRevenue: number;
  pending: number;
  completed: number;
  failed: number;
  refunded: number;
}

export interface TransactionFilters {
  status?: TransactionStatus;
  paymentProvider?: PaymentProvider;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface TransactionQueryParams extends TransactionFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
