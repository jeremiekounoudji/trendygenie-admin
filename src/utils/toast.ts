import { addToast } from '@heroui/react';
import { TOAST } from '../constants/config';

/**
 * Utility functions for displaying toast notifications using HeroUI
 */

export interface ToastOptions {
  title?: string;
  description: string;
  timeout?: number;
}

/**
 * Display a success toast notification
 */
export const showSuccess = (options: ToastOptions | string) => {
  const config = typeof options === 'string' 
    ? { description: options }
    : options;

  addToast({
    title: config.title || 'Success',
    description: config.description,
    color: 'success',
    timeout: config.timeout || TOAST.SUCCESS_DURATION,
  });
};

/**
 * Display an error toast notification
 */
export const showError = (options: ToastOptions | string) => {
  const config = typeof options === 'string' 
    ? { description: options }
    : options;

  addToast({
    title: config.title || 'Error',
    description: config.description,
    color: 'danger',
    timeout: config.timeout || TOAST.ERROR_DURATION,
  });
};

/**
 * Display a warning toast notification
 */
export const showWarning = (options: ToastOptions | string) => {
  const config = typeof options === 'string' 
    ? { description: options }
    : options;

  addToast({
    title: config.title || 'Warning',
    description: config.description,
    color: 'warning',
    timeout: config.timeout || TOAST.WARNING_DURATION,
  });
};

/**
 * Display an info toast notification
 */
export const showInfo = (options: ToastOptions | string) => {
  const config = typeof options === 'string' 
    ? { description: options }
    : options;

  addToast({
    title: config.title || 'Info',
    description: config.description,
    color: 'primary',
    timeout: config.timeout || TOAST.INFO_DURATION,
  });
};

/**
 * Predefined toast messages for common operations
 */
export const TOAST_MESSAGES = {
  // Success messages
  SUCCESS: {
    CREATED: 'Item created successfully',
    UPDATED: 'Item updated successfully',
    DELETED: 'Item deleted successfully',
    STATUS_UPDATED: 'Status updated successfully',
    LOGIN: 'Login successful',
    LOGOUT: 'Logged out successfully',
    REGISTRATION: 'Registration successful',
    SAVED: 'Changes saved successfully',
  },
  
  // Error messages
  ERROR: {
    GENERIC: 'An unexpected error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection and try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    FORBIDDEN: 'Access denied. Please contact an administrator.',
    NOT_FOUND: 'The requested resource was not found.',
    VALIDATION: 'Please check your input and try again.',
    LOGIN_FAILED: 'Invalid email or password. Please try again.',
    REGISTRATION_FAILED: 'Registration failed. Please try again.',
    DELETE_FAILED: 'Failed to delete item. Please try again.',
    UPDATE_FAILED: 'Failed to update item. Please try again.',
    CREATE_FAILED: 'Failed to create item. Please try again.',
    LOAD_FAILED: 'Failed to load data. Please refresh the page.',
  },
  
  // Warning messages
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes. Are you sure you want to leave?',
    DELETE_CONFIRM: 'This action cannot be undone. Are you sure?',
    STATUS_CHANGE: 'This will change the item status. Continue?',
  },
  
  // Info messages
  INFO: {
    LOADING: 'Loading...',
    SAVING: 'Saving changes...',
    DELETING: 'Deleting item...',
    PROCESSING: 'Processing request...',
  },
} as const;

/**
 * Helper functions for common operations
 */
export const toastHelpers = {
  /**
   * Show success toast for CRUD operations
   */
  crud: {
    created: (itemType: string) => showSuccess(`${itemType} created successfully`),
    updated: (itemType: string) => showSuccess(`${itemType} updated successfully`),
    deleted: (itemType: string) => showSuccess(`${itemType} deleted successfully`),
    statusUpdated: (itemType: string) => showSuccess(`${itemType} status updated successfully`),
  },
  
  /**
   * Show error toast for CRUD operations
   */
  crudError: {
    create: (itemType: string) => showError(`Failed to create ${itemType}. Please try again.`),
    update: (itemType: string) => showError(`Failed to update ${itemType}. Please try again.`),
    delete: (itemType: string) => showError(`Failed to delete ${itemType}. Please try again.`),
    load: (itemType: string) => showError(`Failed to load ${itemType}. Please refresh the page.`),
  },
  
  /**
   * Show authentication related toasts
   */
  auth: {
    loginSuccess: () => showSuccess(TOAST_MESSAGES.SUCCESS.LOGIN),
    loginError: () => showError(TOAST_MESSAGES.ERROR.LOGIN_FAILED),
    logoutSuccess: () => showSuccess(TOAST_MESSAGES.SUCCESS.LOGOUT),
    registrationSuccess: () => showSuccess(TOAST_MESSAGES.SUCCESS.REGISTRATION),
    registrationError: () => showError(TOAST_MESSAGES.ERROR.REGISTRATION_FAILED),
    unauthorized: () => showError(TOAST_MESSAGES.ERROR.UNAUTHORIZED),
  },
  
  /**
   * Show network related toasts
   */
  network: {
    error: () => showError(TOAST_MESSAGES.ERROR.NETWORK),
    timeout: () => showError('Request timed out. Please try again.'),
    offline: () => showWarning('You appear to be offline. Some features may not work.'),
  },
};