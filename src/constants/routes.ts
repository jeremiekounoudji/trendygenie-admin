// Route path constants for the admin panel

export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Main routes
  DASHBOARD: '/',
  USERS: '/users',
  COMPANIES: '/companies',
  BUSINESSES: '/businesses',
  SERVICES: '/services',
  LEGAL_PAGES: '/legal-pages',
  TRANSACTIONS: '/transactions',

  // Detail routes
  USER_DETAIL: '/users/:id',
  COMPANY_DETAIL: '/companies/:id',
  BUSINESS_DETAIL: '/businesses/:id',
  SERVICE_DETAIL: '/services/:id',
  LEGAL_PAGE_DETAIL: '/legal-pages/:id',
  TRANSACTION_DETAIL: '/transactions/:id',

  // Create routes
  LEGAL_PAGE_CREATE: '/legal-pages/new',
} as const;

// Helper function to generate detail routes with IDs
export const getDetailRoute = (base: string, id: string): string => {
  return `${base}/${id}`;
};

// Navigation items for sidebar
export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'dashboard' },
  { label: 'Users', path: ROUTES.USERS, icon: 'users' },
  { label: 'Companies', path: ROUTES.COMPANIES, icon: 'building' },
  { label: 'Businesses', path: ROUTES.BUSINESSES, icon: 'store' },
  { label: 'Services', path: ROUTES.SERVICES, icon: 'services' },
  { label: 'Legal Pages', path: ROUTES.LEGAL_PAGES, icon: 'document' },
  { label: 'Transactions', path: ROUTES.TRANSACTIONS, icon: 'credit-card' },
];
