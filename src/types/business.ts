// Business types for admin panel

import type { Company } from './company';
import type { Category, Subcategory } from './category';

export type BusinessStatus = 'pending' | 'active' | 'rejected' | 'suspended' | 'removed' | 'deleted';

export interface ContactPhone {
  number: string;
  label?: string;
}

export interface BusinessHour {
  day: string;
  open: string;
  close: string;
  is_closed: boolean;
}

export interface Business {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  address: string;
  contact_email: string;
  contact_phone: ContactPhone[];
  company_id: string;
  category_id: string | null;
  subcategory_id: string | null;
  status: BusinessStatus;
  rating: number;
  business_hours: BusinessHour[];
  latitude: number | null;
  longitude: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
  // Joined data
  company?: Company;
  category?: Category;
  subcategory?: Subcategory;
}

export interface BusinessStats {
  total: number;
  active: number;
  pending: number;
  suspended: number;
  rejected: number;
}

export interface BusinessFilters {
  status?: BusinessStatus;
  categoryId?: string;
  companyId?: string;
  search?: string;
}

export interface BusinessQueryParams extends BusinessFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateBusinessInput {
  status?: BusinessStatus;
  name?: string;
  description?: string;
  address?: string;
  contact_email?: string;
  contact_phone?: ContactPhone[];
  business_hours?: BusinessHour[];
}
