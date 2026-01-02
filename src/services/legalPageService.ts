// Legal page service for admin panel
import { supabase } from './supabase';
import type { LegalPage, CreateLegalPageInput, UpdateLegalPageInput, LegalPageFilters } from '../types/legalPage';
import type { ApiError } from '../types/common';

export interface LegalPageResponse {
  legalPage: LegalPage | null;
  error: ApiError | null;
}

export interface LegalPagesResponse {
  legalPages: LegalPage[] | null;
  error: ApiError | null;
}

/**
 * Get all legal pages with optional filtering
 */
export async function getLegalPages(filters: LegalPageFilters = {}): Promise<LegalPagesResponse> {
  try {
    const { pageType, isActive, search } = filters;

    let query = supabase
      .from('legal_pages')
      .select('*')
      .order('updated_at', { ascending: false });

    // Apply filters
    if (pageType) {
      query = query.eq('page_type', pageType);
    }

    if (isActive !== undefined) {
      query = query.eq('is_active', isActive);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return {
        legalPages: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      legalPages: data as LegalPage[],
      error: null,
    };
  } catch (err) {
    return {
      legalPages: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch legal pages' },
    };
  }
}

/**
 * Get a single legal page by ID
 */
export async function getLegalPageById(id: string): Promise<LegalPageResponse> {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return {
        legalPage: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      legalPage: data as LegalPage,
      error: null,
    };
  } catch (err) {
    return {
      legalPage: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch legal page' },
    };
  }
}

/**
 * Get a legal page by slug
 */
export async function getLegalPageBySlug(slug: string): Promise<LegalPageResponse> {
  try {
    const { data, error } = await supabase
      .from('legal_pages')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      return {
        legalPage: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      legalPage: data as LegalPage,
      error: null,
    };
  } catch (err) {
    return {
      legalPage: null,
      error: { message: err instanceof Error ? err.message : 'Failed to fetch legal page' },
    };
  }
}

/**
 * Create a new legal page
 */
export async function createLegalPage(input: CreateLegalPageInput): Promise<LegalPageResponse> {
  try {
    // Validate slug uniqueness
    const { data: existing } = await supabase
      .from('legal_pages')
      .select('id')
      .eq('slug', input.slug)
      .single();

    if (existing) {
      return {
        legalPage: null,
        error: { message: 'A legal page with this slug already exists' },
      };
    }

    const { data, error } = await supabase
      .from('legal_pages')
      .insert({
        title: input.title,
        slug: input.slug,
        page_type: input.page_type,
        content: input.content,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      return {
        legalPage: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      legalPage: data as LegalPage,
      error: null,
    };
  } catch (err) {
    return {
      legalPage: null,
      error: { message: err instanceof Error ? err.message : 'Failed to create legal page' },
    };
  }
}

/**
 * Update an existing legal page
 */
export async function updateLegalPage(id: string, input: UpdateLegalPageInput): Promise<LegalPageResponse> {
  try {
    // If updating slug, check uniqueness
    if (input.slug) {
      const { data: existing } = await supabase
        .from('legal_pages')
        .select('id')
        .eq('slug', input.slug)
        .neq('id', id)
        .single();

      if (existing) {
        return {
          legalPage: null,
          error: { message: 'A legal page with this slug already exists' },
        };
      }
    }

    const updateData: Record<string, unknown> = {
      ...input,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('legal_pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return {
        legalPage: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    return {
      legalPage: data as LegalPage,
      error: null,
    };
  } catch (err) {
    return {
      legalPage: null,
      error: { message: err instanceof Error ? err.message : 'Failed to update legal page' },
    };
  }
}

/**
 * Delete a legal page by ID
 */
export async function deleteLegalPage(id: string): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase
      .from('legal_pages')
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
      error: { message: err instanceof Error ? err.message : 'Failed to delete legal page' },
    };
  }
}

/**
 * Generate a slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-'); // Remove consecutive hyphens
}
