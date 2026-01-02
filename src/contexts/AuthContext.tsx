// Authentication context for admin panel with proper caching
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { User, CreateUserInput } from '../types/user';
import type { ApiError } from '../types/common';
import * as authService from '../services/authService';
import { toastHelpers } from '../utils/toast';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (input: CreateUserInput) => Promise<boolean>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Cache keys for localStorage
const AUTH_CACHE_KEY = 'trendygenie_admin_auth_cache';
const AUTH_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

interface CachedAuth {
  user: User | null;
  timestamp: number;
}

function getCachedAuth(): CachedAuth | null {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached) as CachedAuth;
      // Check if cache is still valid
      if (Date.now() - parsed.timestamp < AUTH_CACHE_EXPIRY) {
        return parsed;
      }
    }
  } catch {
    // Ignore cache errors
  }
  return null;
}

function setCachedAuth(user: User | null): void {
  try {
    const cache: CachedAuth = { user, timestamp: Date.now() };
    localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore cache errors
  }
}

function clearCachedAuth(): void {
  try {
    localStorage.removeItem(AUTH_CACHE_KEY);
  } catch {
    // Ignore cache errors
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);
  const initialized = useRef(false);

  // Initialize auth on mount - only once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('AuthContext: Initializing auth...');
        setLoading(true);
        
        // Check cached auth first
        const cached = getCachedAuth();
        if (cached?.user) {
          console.log('AuthContext: Found cached user');
          setUser(cached.user);
          setLoading(false);
          // Still verify in background but don't show loading
          verifyAuthInBackground(mounted);
          return;
        }

        // No cache, verify auth
        await verifyAuth(mounted);
      } catch (err) {
        console.error('AuthContext: Init auth error:', err);
        if (mounted) {
          setUser(null);
          clearCachedAuth();
          setError({ message: err instanceof Error ? err.message : 'Authentication failed' });
          setLoading(false);
        }
      }
    };

    const verifyAuth = async (isMounted: boolean) => {
      try {
        const { user: currentUser, error: sessionError } = await authService.getCurrentUser();
        console.log('AuthContext: Got user result:', { user: !!currentUser, error: !!sessionError });
        
        if (isMounted) {
          if (sessionError) {
            console.log('AuthContext: Session error, clearing user');
            setUser(null);
            clearCachedAuth();
            setError(sessionError);
          } else if (currentUser) {
            console.log('AuthContext: User found, setting user');
            setUser(currentUser);
            setCachedAuth(currentUser);
            setError(null);
          } else {
            console.log('AuthContext: No user found');
            setUser(null);
            clearCachedAuth();
            setError(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('AuthContext: Verify auth error:', err);
        if (isMounted) {
          setUser(null);
          clearCachedAuth();
          setError({ message: err instanceof Error ? err.message : 'Authentication failed' });
          setLoading(false);
        }
      }
    };

    const verifyAuthInBackground = async (isMounted: boolean) => {
      try {
        const { user: currentUser, error: sessionError } = await authService.getCurrentUser();
        
        if (isMounted) {
          if (sessionError || !currentUser) {
            console.log('AuthContext: Background verification failed, clearing user');
            setUser(null);
            clearCachedAuth();
            setError(sessionError);
          } else if (currentUser) {
            console.log('AuthContext: Background verification successful');
            setUser(currentUser);
            setCachedAuth(currentUser);
            setError(null);
          }
        }
      } catch (err) {
        console.error('AuthContext: Background verification error:', err);
        // Don't clear user on background verification errors
      }
    };

    initAuth();

    // Fallback timeout to ensure loading never gets stuck
    const fallbackTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('AuthContext: Fallback timeout triggered, stopping loading');
        setLoading(false);
        setError({ message: 'Authentication verification timed out' });
      }
    }, 15000);

    // Subscribe to auth state changes - simplified
    const authSubscription = authService.onAuthStateChange((updatedUser) => {
      if (mounted) {
        console.log('AuthContext: Auth state changed:', !!updatedUser);
        if (updatedUser) {
          setUser(updatedUser);
          setCachedAuth(updatedUser);
          setError(null);
        } else {
          setUser(null);
          clearCachedAuth();
          setError(null);
        }
        setLoading(false);
      }
    });
    const { data: { subscription } } = authSubscription as any;

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { user: loggedInUser, error: loginError } = await authService.login(email, password);

      if (loginError) {
        setError(loginError);
        toastHelpers.auth.loginError();
        setLoading(false);
        return false;
      }

      setUser(loggedInUser);
      setCachedAuth(loggedInUser);
      toastHelpers.auth.loginSuccess();
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError({ message: errorMessage });
      toastHelpers.auth.loginError();
      setLoading(false);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const { error: logoutError } = await authService.logout();

      if (logoutError) {
        setError(logoutError);
      } else {
        toastHelpers.auth.logoutSuccess();
      }

      setUser(null);
      clearCachedAuth();
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Logout failed' });
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (input: CreateUserInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const { error: registerError } = await authService.register(input);

      if (registerError) {
        setError(registerError);
        toastHelpers.auth.registrationError();
        setLoading(false);
        return false;
      }

      toastHelpers.auth.registrationSuccess();
      setLoading(false);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError({ message: errorMessage });
      toastHelpers.auth.registrationError();
      setLoading(false);
      return false;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
