// Legal page types for admin panel

export type LegalPageType = 'terms' | 'privacy' | 'refund' | 'cookie' | 'other';

export interface LegalPage {
  id: string;
  title: string;
  slug: string;
  page_type: LegalPageType;
  content: string; // HTML content
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLegalPageInput {
  title: string;
  slug: string;
  page_type: LegalPageType;
  content: string;
}

export interface UpdateLegalPageInput {
  title?: string;
  slug?: string;
  content?: string;
  is_active?: boolean;
}

export interface LegalPageFilters {
  pageType?: LegalPageType;
  isActive?: boolean;
  search?: string;
}
