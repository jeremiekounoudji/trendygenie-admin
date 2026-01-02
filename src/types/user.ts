// User types for admin panel

export type UserType = 'customer' | 'provider' | 'admin';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  phone_number: string | null;
  profile_image: string | null;
  user_type: UserType;
  is_active: boolean;
  is_email_verified: boolean;
  is_phone_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  customers: number;
  providers: number;
  admins: number;
}

export interface UserFilters {
  userType?: UserType;
  isActive?: boolean;
  search?: string;
}

export interface UserQueryParams extends UserFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateUserInput {
  email: string;
  password: string;
  full_name: string;
  user_type: UserType;
}

export interface UpdateUserInput {
  full_name?: string;
  phone_number?: string;
  profile_image?: string;
  is_active?: boolean;
}
