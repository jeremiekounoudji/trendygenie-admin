// Service types for admin panel

import type { Business } from './business';
import type { Category } from './category';
import type { User } from './user';

export type ServiceStatus = 'pending' | 'active' | 'rejected' | 'suspended' | 'deleted' | 'requestDeletion';

export interface Service {
  id: string;
  title: string;
  description: string | null;
  category_id: string;
  images: string[];
  rating: number;
  distance: number;
  status: ServiceStatus;
  normal_price: number;
  promotional_price: number;
  currency: string;
  bedroom_count: number | null;
  bathroom_count: number | null;
  has_kitchen: boolean | null;
  property_type: string | null;
  cuisine: string | null;
  is_delivery_available: boolean | null;
  food_category: string | null;
  caracteristics: Record<string, unknown> | null;
  provider_id: string;
  business_id: string | null;
  company_id: string | null;
  created_by: string | null;
  is_active: boolean;
  view_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  // Joined data
  business?: Business;
  category?: Category;
  provider?: User;
}

export interface ServiceStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
  requestDeletion: number;
}

export interface ServiceFilters {
  status?: ServiceStatus;
  categoryId?: string;
  businessId?: string;
  search?: string;
}

export interface ServiceQueryParams extends ServiceFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateServiceInput {
  status?: ServiceStatus;
  title?: string;
  description?: string;
  normal_price?: number;
  promotional_price?: number;
  is_active?: boolean;
}
