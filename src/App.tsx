import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { TOAST } from './constants/config';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import CompaniesPage from './pages/CompaniesPage';
import BusinessesPage from './pages/BusinessesPage';
import ServicesPage from './pages/ServicesPage';
import LegalPagesPage from './pages/LegalPagesPage';
import TransactionsPage from './pages/TransactionsPage';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useEffect } from 'react';
import { onNetworkStatusChange } from './utils/errorHandler';
import { toastHelpers } from './utils/toast';

function App() {
  // Monitor network status
  useEffect(() => {
    const cleanup = onNetworkStatusChange((isOnline) => {
      if (!isOnline) {
        toastHelpers.network.offline();
      }
    });

    return cleanup;
  }, []);

  return (
    <ErrorBoundary>
      <HeroUIProvider>
        <ToastProvider 
          placement={TOAST.PLACEMENT}
          maxVisibleToasts={TOAST.MAX_VISIBLE}
        />
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route 
                path="/login" 
                element={
                  <ErrorBoundary>
                    <LoginPage />
                  </ErrorBoundary>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <ErrorBoundary>
                    <RegisterPage />
                  </ErrorBoundary>
                } 
              />
              
              {/* Protected routes with MainLayout */}
              <Route 
                path="/" 
                element={
                  <ErrorBoundary>
                    <ProtectedRoute>
                      <MainLayout />
                    </ProtectedRoute>
                  </ErrorBoundary>
                }
              >
                {/* Dashboard - default route */}
                <Route index element={<DashboardPage />} />
                
                {/* Management pages */}
                <Route path="users" element={<UsersPage />} />
                <Route path="companies" element={<CompaniesPage />} />
                <Route path="businesses" element={<BusinessesPage />} />
                <Route path="services" element={<ServicesPage />} />
                <Route path="legal-pages" element={<LegalPagesPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
              </Route>
              
              {/* Legacy redirect */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
              
              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </AuthProvider>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}

export default App;