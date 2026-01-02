// Authentication hook for admin panel
import { useState, useEffect, useCallback } from 'react';
import type { User, CreateUserInput } from '../types/user';
import type { ApiError } from '../types/common';
import * as authService from '../services/authService';
import { toastHelpers } from '../utils/toast';

export interface UseAuthReturn {
  user: User | null;
  loading: boolean;
  error: ApiError | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (input: CreateUserInput) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Custom hook for authentication state management
 * Handles login, logout, register, and session persistence
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { user: currentUser, error: sessionError } = await authService.getCurrentUser();
        console.log('Auth result:', { currentUser: !!currentUser, sessionError });
        
        if (mounted) {
          if (sessionError) {
            console.error('Session error:', sessionError);
            setUser(null);
            setError(sessionError);
          } else {
            console.log('Setting user:', !!currentUser);
            setUser(currentUser);
            setError(null);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        if (mounted) {
          setUser(null);
          setError({ message: err instanceof Error ? err.message : 'Authentication failed' });
          setLoading(false);
        }
      }
    };

    // Set a fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (mounted && loading) {
        console.warn('Auth initialization timed out, setting loading to false');
        setLoading(false);
        setError({ message: 'Authentication check timed out. Please refresh the page.' });
      }
    }, 15000);

    initAuth();

    // Subscribe to auth state changes
    const { data: { subscription } } = authService.onAuthStateChange((updatedUser) => {
      if (mounted) {
        console.log('Auth state changed:', !!updatedUser);
        setUser(updatedUser);
        if (updatedUser !== null) {
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  /**
   * Login with email and password
   * Returns true on success, false on failure
   */
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

  /**
   * Logout the current user
   */
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
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Logout failed' });
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Register a new admin user
   * Returns true on success, false on failure
   */
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

      // Registration successful - user is created but not logged in
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

  /**
   * Clear any existing error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    register,
    clearError,
  };
}

export default useAuth;
