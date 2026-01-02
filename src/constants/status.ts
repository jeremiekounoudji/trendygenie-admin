// Status enums and labels for the admin panel

import type { UserType } from '../types/user';
import type { CompanyStatus } from '../types/company';
import type { BusinessStatus } from '../types/business';
import type { ServiceStatus } from '../types/service';
import type { LegalPageType } from '../types/legalPage';
import type { TransactionStatus, PaymentProvider } from '../types/transaction';

// User type labels
export const USER_TYPE_LABELS: Record<UserType, string> = {
  customer: 'Customer',
  provider: 'Provider',
  admin: 'Admin',
};

// Company status labels and colors
export const COMPANY_STATUS_LABELS: Record<CompanyStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  rejected: 'Rejected',
  suspended: 'Suspended',
};

export const COMPANY_STATUS_COLORS: Record<CompanyStatus, string> = {
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
  suspended: 'secondary',
};

// Business status labels and colors
export const BUSINESS_STATUS_LABELS: Record<BusinessStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
  suspended: 'Suspended',
  removed: 'Removed',
  deleted: 'Deleted',
};

export const BUSINESS_STATUS_COLORS: Record<BusinessStatus, string> = {
  pending: 'warning',
  active: 'success',
  rejected: 'danger',
  suspended: 'secondary',
  removed: 'default',
  deleted: 'danger',
};

// Service status labels and colors
export const SERVICE_STATUS_LABELS: Record<ServiceStatus, string> = {
  pending: 'Pending',
  active: 'Active',
  rejected: 'Rejected',
  suspended: 'Suspended',
  deleted: 'Deleted',
  requestDeletion: '⚠️ Deletion Requested',
};

export const SERVICE_STATUS_COLORS: Record<ServiceStatus, string> = {
  pending: 'warning',
  active: 'success',
  rejected: 'danger',
  suspended: 'secondary',
  deleted: 'default',
  requestDeletion: 'danger',
};

// Legal page type labels
export const LEGAL_PAGE_TYPE_LABELS: Record<LegalPageType, string> = {
  terms: 'Terms of Service',
  privacy: 'Privacy Policy',
  refund: 'Refund Policy',
  cookie: 'Cookie Policy',
  other: 'Other',
};

// Transaction status labels and colors
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  pending: 'Pending',
  completed: 'Completed',
  failed: 'Failed',
  refunded: 'Refunded',
  cancelled: 'Cancelled',
  processing: 'Processing',
};

export const TRANSACTION_STATUS_COLORS: Record<TransactionStatus, string> = {
  pending: 'warning',
  completed: 'success',
  failed: 'danger',
  refunded: 'secondary',
  cancelled: 'default',
  processing: 'primary',
};

// Payment provider labels
export const PAYMENT_PROVIDER_LABELS: Record<PaymentProvider, string> = {
  stripe: 'Stripe',
  paypal: 'PayPal',
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  square: 'Square',
  razorpay: 'Razorpay',
  flutterwave: 'Flutterwave',
  mpesa: 'M-Pesa',
  google_pay: 'Google Pay',
  apple_pay: 'Apple Pay',
};

// Active/Inactive status
export const ACTIVE_STATUS_LABELS: Record<string, string> = {
  true: 'Active',
  false: 'Inactive',
};

export const ACTIVE_STATUS_COLORS: Record<string, string> = {
  true: 'success',
  false: 'danger',
};
