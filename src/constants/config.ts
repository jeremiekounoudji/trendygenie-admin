// Configuration constants for the admin panel

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100,
} as const;

// API configuration
export const API = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
} as const;

// Toast notification configuration
export const TOAST = {
  SUCCESS_DURATION: 4000, // 4 seconds
  ERROR_DURATION: 6000, // 6 seconds
  WARNING_DURATION: 5000, // 5 seconds
  INFO_DURATION: 4000, // 4 seconds
  MAX_VISIBLE: 3,
  PLACEMENT: 'bottom-right' as const,
} as const;

// Search configuration
export const SEARCH = {
  DEBOUNCE_MS: 300, // 300ms debounce for search input
  MIN_SEARCH_LENGTH: 2, // Minimum characters to trigger search
} as const;

// Date format configuration
export const DATE_FORMAT = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  INPUT: 'yyyy-MM-dd',
  API: 'yyyy-MM-dd\'T\'HH:mm:ss.SSS\'Z\'',
} as const;

// Currency configuration
export const CURRENCY = {
  DEFAULT: 'USD',
  LOCALE: 'en-US',
} as const;

// File upload configuration
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf'],
} as const;

// Validation rules
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBER: true,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// Brand colors (matching TailwindCSS config)
export const BRAND_COLORS = {
  PRIMARY: '#16C79A',
  PRIMARY_LIGHT: '#E8FBF5',
  PRIMARY_DARK: '#12A07B',
} as const;
