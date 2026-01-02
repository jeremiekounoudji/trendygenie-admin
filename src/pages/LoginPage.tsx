import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  Link,
  Divider,
} from '@heroui/react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, clearError } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when form data changes
  useEffect(() => {
    if (error) {
      clearError();
    }
    setFormErrors({});
  }, [formData, error, clearError]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        // Navigation will be handled by the useEffect above
        // when isAuthenticated becomes true
      } else {
        // Clear password field on failed login
        setFormData(prev => ({ ...prev, password: '' }));
      }
    } catch (err) {
      console.error('Login error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardHeader className="flex flex-col gap-3 pb-6">
            <div className="flex flex-col items-center text-center">
              <h1 className="text-3xl font-bold text-primary">
                TrendyGenie
              </h1>
              <p className="text-lg font-semibold text-default-700 mt-1">
                Admin Panel
              </p>
              <p className="text-sm text-default-500 mt-2">
                Sign in to manage the platform
              </p>
            </div>
          </CardHeader>

          <Divider />

          <CardBody className="pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Global error message */}
              {error && (
                <div className="p-3 rounded-lg bg-danger-50 border border-danger-200">
                  <p className="text-sm text-danger-700">{error.message}</p>
                </div>
              )}

              {/* Email field */}
              <Input
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                onValueChange={(value) => handleInputChange('email', value)}
                isInvalid={!!formErrors.email}
                errorMessage={formErrors.email}
                isRequired
                autoComplete="email"
                autoFocus
              />

              {/* Password field */}
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                label="Password"
                placeholder="Enter your password"
                value={formData.password}
                onValueChange={(value) => handleInputChange('password', value)}
                isInvalid={!!formErrors.password}
                errorMessage={formErrors.password}
                isRequired
                autoComplete="current-password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5 text-default-400 pointer-events-none" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />

              {/* Submit button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="mt-2"
                isLoading={isSubmitting || loading}
                isDisabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-default-500">
                Need to register a new admin?{' '}
                <Link
                  href="/register"
                  color="primary"
                  className="font-medium"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-default-400">
            © 2024 TrendyGenie. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}