// Company types for admin panel

import type { User } from './user';
import type { Category } from './category';

export type CompanyStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface Company {
  id: string;
  name: string;
  registration_number: string;
  address: string;
  category_id: string | null;
  owner_id: string;
  status: CompanyStatus;
  company_logo: string | null;
  owner_id_image: string | null;
  selfie_image: string | null;
  is_verified: boolean;
  description: string | null;
  website: string | null;
  email: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
  postal_code: string | null;
  total_orders: number;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  // Joined data
  owner?: User;
  category?: Category;
}

export interface CompanyStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
}

export interface CompanyFilters {
  status?: CompanyStatus;
  categoryId?: string;
  search?: string;
}

export interface CompanyQueryParams extends CompanyFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateCompanyInput {
  status?: CompanyStatus;
  is_verified?: boolean;
  approved_at?: string | null;
}
