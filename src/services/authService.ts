// Authentication service for admin panel
import { supabase } from './supabase';
import type { User, CreateUserInput } from '../types/user';
import type { ApiError } from '../types/common';

// Utility function to add timeout to promises or thenable objects (like PostgrestBuilder)
function withTimeout<T>(thenable: PromiseLike<T>, timeoutMs: number = 10000): Promise<T> {
  return Promise.race([
    Promise.resolve(thenable),
    new Promise<T>((_, reject) => 
      setTimeout(() => reject(new Error(`Operation timed out after ${timeoutMs}ms`)), timeoutMs)
    )
  ]);
}

export interface AuthResponse {
  user: User | null;
  error: ApiError | null;
}

export interface SessionResponse {
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  } | null;
  user: User | null;
  error: ApiError | null;
}

/**
 * Login with email and password
 * Verifies that the user has admin role before allowing access
 */
export async function login(email: string, password: string): Promise<SessionResponse> {
  try {
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return {
        session: null,
        user: null,
        error: {
          message: authError.message,
          code: authError.code,
          status: authError.status,
        },
      };
    }

    if (!authData.user) {
      return {
        session: null,
        user: null,
        error: { message: 'Authentication failed. Please try again.' },
      };
    }

    // Fetch user profile to verify admin role
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      // Sign out if we can't verify the user
      await supabase.auth.signOut();
      return {
        session: null,
        user: null,
        error: {
          message: 'Failed to verify user profile.',
          code: userError.code,
        },
      };
    }

    // Verify admin role
    if (userData.user_type !== 'admin') {
      await supabase.auth.signOut();
      return {
        session: null,
        user: null,
        error: { message: 'Access denied. Admin privileges required.' },
      };
    }

    return {
      session: authData.session ? {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
        expires_at: authData.session.expires_at ?? 0,
      } : null,
      user: userData as User,
      error: null,
    };
  } catch (err) {
    return {
      session: null,
      user: null,
      error: { message: err instanceof Error ? err.message : 'An unexpected error occurred' },
    };
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<{ error: ApiError | null }> {
  try {
    const { error } = await supabase.auth.signOut();
    
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
      error: { message: err instanceof Error ? err.message : 'Failed to logout' },
    };
  }
}

/**
 * Register a new admin user
 * Only existing admins should be able to call this
 */
export async function register(input: CreateUserInput): Promise<AuthResponse> {
  try {
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.full_name,
          user_type: input.user_type,
        },
      },
    });

    if (authError) {
      return {
        user: null,
        error: {
          message: authError.message,
          code: authError.code,
          status: authError.status,
        },
      };
    }

    if (!authData.user) {
      return {
        user: null,
        error: { message: 'Registration failed. Please try again.' },
      };
    }

    // Create user profile in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: input.email,
        full_name: input.full_name,
        user_type: input.user_type,
        is_active: true,
        is_email_verified: false,
        is_phone_verified: false,
      })
      .select()
      .single();

    if (userError) {
      return {
        user: null,
        error: {
          message: userError.message,
          code: userError.code,
        },
      };
    }

    return {
      user: userData as User,
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      error: { message: err instanceof Error ? err.message : 'Registration failed' },
    };
  }
}

/**
 * Get the currently authenticated user
 * Returns null if not authenticated or not an admin
 */
export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    console.log('authService: Getting current user...');
    
    // First check if we have a session with timeout
    const sessionResult = await withTimeout(
      supabase.auth.getSession(),
      8000
    );
    const { data: { session }, error: sessionError } = sessionResult as any;
    console.log('authService: Session check:', { session: !!session, sessionError });
    
    if (sessionError) {
      console.error('authService: Session error:', sessionError);
      return {
        user: null,
        error: {
          message: sessionError.message,
          code: sessionError.code,
        },
      };
    }
    
    if (!session) {
      console.log('authService: No active session');
      return {
        user: null,
        error: null,
      };
    }

    // Get the authenticated user with timeout
    const userResult = await withTimeout(
      supabase.auth.getUser(),
      8000
    );
    const { data: { user: authUser }, error: authError } = userResult as any;
    console.log('authService: Auth user result:', { authUser: !!authUser, authError });

    if (authError || !authUser) {
      console.log('authService: No auth user or error:', authError);
      return {
        user: null,
        error: authError ? {
          message: authError.message,
          code: authError.code,
        } : null,
      };
    }

    console.log('authService: Fetching user profile for:', authUser.id);
    // Fetch user profile with timeout - this should work because auth.uid() = id due to RLS policy
    const userProfileResult = await withTimeout(
      supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single(),
      8000
    );
    const { data: userData, error: userError } = userProfileResult as any;

    console.log('authService: User profile result:', { userData: !!userData, userError });

    if (userError) {
      console.error('authService: User profile error:', userError);
      return {
        user: null,
        error: {
          message: userError.message,
          code: userError.code,
        },
      };
    }

    // Verify admin role
    if (userData.user_type !== 'admin') {
      console.log('authService: User is not admin:', userData.user_type);
      return {
        user: null,
        error: { message: 'Access denied. Admin privileges required.' },
      };
    }

    console.log('authService: Admin user verified:', userData.email);
    return {
      user: userData as User,
      error: null,
    };
  } catch (err) {
    console.error('authService: getCurrentUser catch error:', err);
    return {
      user: null,
      error: { message: err instanceof Error ? err.message : 'Failed to get current user' },
    };
  }
}

/**
 * Check if there's an active session
 */
export async function getSession(): Promise<SessionResponse> {
  try {
    const sessionResult = await supabase.auth.getSession();
    const { data: { session }, error } = sessionResult as any;

    if (error) {
      return {
        session: null,
        user: null,
        error: {
          message: error.message,
          code: error.code,
        },
      };
    }

    if (!session) {
      return {
        session: null,
        user: null,
        error: null,
      };
    }

    // Get user profile
    const { user, error: userError } = await getCurrentUser();

    return {
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at ?? 0,
      },
      user,
      error: userError,
    };
  } catch (err) {
    return {
      session: null,
      user: null,
      error: { message: err instanceof Error ? err.message : 'Failed to get session' },
    };
  }
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange(async (event: string, session: any) => {
    if (event === 'SIGNED_OUT' || !session) {
      callback(null);
      return;
    }

    if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
      const { user } = await getCurrentUser();
      callback(user);
    }
  });
}

/**
 * Validate password meets security requirements
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
