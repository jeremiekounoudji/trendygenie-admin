// Category types for admin panel

export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  parent_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subcategory {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
