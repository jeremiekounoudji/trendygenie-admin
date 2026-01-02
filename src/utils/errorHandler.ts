import { showError, showWarning, toastHelpers } from './toast';
import type { ApiError } from '../types/common';

/**
 * Error handling utilities for the admin panel
 */

export interface NetworkErrorOptions {
  retry?: () => Promise<void>;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Handle API errors with appropriate user feedback
 */
export function handleApiError(error: ApiError, context?: string): void {
  const contextPrefix = context ? `${context}: ` : '';

  switch (error.status) {
    case 400:
      showError(`${contextPrefix}Invalid request. Please check your input and try again.`);
      break;
    case 401:
      toastHelpers.auth.unauthorized();
      // Redirect to login after a short delay
      setTimeout(() => {
        window.location.href = '/login';
      }, 2000);
      break;
    case 403:
      showError(`${contextPrefix}Access denied. You don't have permission to perform this action.`);
      break;
    case 404:
      showError(`${contextPrefix}The requested resource was not found.`);
      break;
    case 409:
      showError(`${contextPrefix}Conflict: ${error.message || 'The resource already exists or is in use.'}`);
      break;
    case 422:
      showError(`${contextPrefix}Validation failed: ${error.message || 'Please check your input.'}`);
      break;
    case 429:
      showWarning(`${contextPrefix}Too many requests. Please wait a moment and try again.`);
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      showError(`${contextPrefix}Server error. Please try again later or contact support.`);
      break;
    default:
      if (error.message) {
        showError(`${contextPrefix}${error.message}`);
      } else {
        showError(`${contextPrefix}An unexpected error occurred. Please try again.`);
      }
  }
}

/**
 * Handle network errors with retry functionality
 */
export async function handleNetworkError(
  error: Error,
  options: NetworkErrorOptions = {}
): Promise<void> {
  const { retry, maxRetries = 3, retryDelay = 1000 } = options;

  // Check if it's a network error
  if (
    error.message.includes('fetch') ||
    error.message.includes('network') ||
    error.message.includes('NetworkError') ||
    error.name === 'TypeError'
  ) {
    toastHelpers.network.error();

    // Offer retry if available
    if (retry && maxRetries > 0) {
      setTimeout(async () => {
        try {
          await retry();
        } catch (retryError) {
          if (retryError instanceof Error) {
            await handleNetworkError(retryError, {
              ...options,
              maxRetries: maxRetries - 1,
            });
          }
        }
      }, retryDelay);
    }
  } else {
    // Generic error handling
    showError(error.message || 'An unexpected error occurred.');
  }
}

/**
 * Wrapper for async operations with error handling
 */
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context?: string,
  options: NetworkErrorOptions = {}
): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      // API error
      handleApiError(error as ApiError, context);
    } else if (error instanceof Error) {
      // Network or other error
      await handleNetworkError(error, options);
    } else {
      // Unknown error
      showError(context ? `${context}: An unexpected error occurred.` : 'An unexpected error occurred.');
    }
    return null;
  }
}

/**
 * Validate form data and show validation errors
 */
export interface ValidationRule<T> {
  field: keyof T;
  validate: (value: any) => string | null;
  message?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateForm<T extends Record<string, any>>(
  data: T,
  rules: ValidationRule<T>[]
): ValidationResult {
  const errors: Record<string, string> = {};

  for (const rule of rules) {
    const value = data[rule.field];
    const error = rule.validate(value);
    
    if (error) {
      errors[rule.field as string] = rule.message || error;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Common validation functions
 */
export const validators = {
  required: (value: any): string | null => {
    if (value === null || value === undefined || value === '') {
      return 'This field is required';
    }
    if (typeof value === 'string' && value.trim() === '') {
      return 'This field is required';
    }
    return null;
  },

  email: (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : 'Please enter a valid email address';
  },

  minLength: (min: number) => (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    return value.length >= min ? null : `Must be at least ${min} characters long`;
  },

  maxLength: (max: number) => (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    return value.length <= max ? null : `Must be no more than ${max} characters long`;
  },

  password: (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    
    const errors: string[] = [];
    
    if (value.length < 8) {
      errors.push('at least 8 characters');
    }
    if (!/[A-Z]/.test(value)) {
      errors.push('one uppercase letter');
    }
    if (!/[a-z]/.test(value)) {
      errors.push('one lowercase letter');
    }
    if (!/[0-9]/.test(value)) {
      errors.push('one number');
    }
    
    return errors.length > 0 
      ? `Password must contain ${errors.join(', ')}`
      : null;
  },

  url: (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    try {
      new URL(value);
      return null;
    } catch {
      return 'Please enter a valid URL';
    }
  },

  numeric: (value: string): string | null => {
    if (!value) return null; // Let required validator handle empty values
    return /^\d+$/.test(value) ? null : 'Please enter a valid number';
  },

  positiveNumber: (value: number): string | null => {
    if (value === null || value === undefined) return null;
    return value > 0 ? null : 'Must be a positive number';
  },
};

/**
 * Debounce function for form validation
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if user is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Listen for online/offline events
 */
export function onNetworkStatusChange(callback: (isOnline: boolean) => void): () => void {
  const handleOnline = () => callback(true);
  const handleOffline = () => callback(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Retry mechanism for failed operations
 */
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000,
  backoff: boolean = true
): Promise<T> {
  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Wait before retrying
      const waitTime = backoff ? delay * Math.pow(2, attempt) : delay;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw lastError!;
}