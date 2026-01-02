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
  Chip,
} from '@heroui/react';
import { EyeIcon, EyeSlashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { validateEmail, validatePassword } from '../services/authService';
import type { CreateUserInput } from '../types/user';

interface PasswordRequirement {
  text: string;
  met: boolean;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, loading, error, isAuthenticated, clearError } = useAuth();

  const [formData, setFormData] = useState<CreateUserInput>({
    email: '',
    password: '',
    full_name: '',
    user_type: 'admin',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

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
  }, [formData, confirmPassword, error, clearError]);

  // Password requirements validation
  const getPasswordRequirements = (password: string): PasswordRequirement[] => {
    return [
      {
        text: 'At least 8 characters',
        met: password.length >= 8,
      },
      {
        text: 'One uppercase letter',
        met: /[A-Z]/.test(password),
      },
      {
        text: 'One lowercase letter',
        met: /[a-z]/.test(password),
      },
      {
        text: 'One number',
        met: /[0-9]/.test(password),
      },
    ];
  };

  const passwordRequirements = getPasswordRequirements(formData.password);
  const isPasswordValid = passwordRequirements.every(req => req.met);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Full name validation
    if (!formData.full_name.trim()) {
      errors.full_name = 'Full name is required';
    } else if (formData.full_name.trim().length < 2) {
      errors.full_name = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.valid) {
        errors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
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
      const success = await register(formData);
      
      if (success) {
        setRegistrationSuccess(true);
        // Clear form
        setFormData({
          email: '',
          password: '',
          full_name: '',
          user_type: 'admin',
        });
        setConfirmPassword('');
      }
    } catch (err) {
      console.error('Registration error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateUserInput | 'confirmPassword', value: string) => {
    if (field === 'confirmPassword') {
      setConfirmPassword(value);
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  // Show success message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl">
            <CardBody className="text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                  <CheckIcon className="w-8 h-8 text-success-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-default-700 mb-2">
                Registration Successful!
              </h2>
              <p className="text-default-500 mb-6">
                The admin account has been created successfully. You can now sign in with the new credentials.
              </p>
              <Button
                color="primary"
                size="lg"
                onPress={handleBackToLogin}
                className="w-full"
              >
                Back to Sign In
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    );
  }

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
                Admin Registration
              </p>
              <p className="text-sm text-default-500 mt-2">
                Create a new admin account
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

              {/* Full name field */}
              <Input
                type="text"
                label="Full Name"
                placeholder="Enter full name"
                value={formData.full_name}
                onValueChange={(value) => handleInputChange('full_name', value)}
                isInvalid={!!formErrors.full_name}
                errorMessage={formErrors.full_name}
                isRequired
                autoComplete="name"
                autoFocus
              />

              {/* Email field */}
              <Input
                type="email"
                label="Email"
                placeholder="Enter email address"
                value={formData.email}
                onValueChange={(value) => handleInputChange('email', value)}
                isInvalid={!!formErrors.email}
                errorMessage={formErrors.email}
                isRequired
                autoComplete="email"
              />

              {/* Password field */}
              <Input
                type={isPasswordVisible ? 'text' : 'password'}
                label="Password"
                placeholder="Create a password"
                value={formData.password}
                onValueChange={(value) => handleInputChange('password', value)}
                isInvalid={!!formErrors.password}
                errorMessage={formErrors.password}
                isRequired
                autoComplete="new-password"
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

              {/* Password requirements */}
              {formData.password && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-default-600">Password requirements:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {passwordRequirements.map((req, index) => (
                      <div key={index} className="flex items-center gap-2">
                        {req.met ? (
                          <CheckIcon className="h-4 w-4 text-success-500" />
                        ) : (
                          <XMarkIcon className="h-4 w-4 text-default-400" />
                        )}
                        <span className={`text-xs ${req.met ? 'text-success-600' : 'text-default-500'}`}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Confirm password field */}
              <Input
                type={isConfirmPasswordVisible ? 'text' : 'password'}
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onValueChange={(value) => handleInputChange('confirmPassword', value)}
                isInvalid={!!formErrors.confirmPassword}
                errorMessage={formErrors.confirmPassword}
                isRequired
                autoComplete="new-password"
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    aria-label="toggle confirm password visibility"
                  >
                    {isConfirmPasswordVisible ? (
                      <EyeSlashIcon className="h-5 w-5 text-default-400 pointer-events-none" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-default-400 pointer-events-none" />
                    )}
                  </button>
                }
              />

              {/* User type indicator */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-default-600">Account Type:</span>
                <Chip color="primary" variant="flat" size="sm">
                  Administrator
                </Chip>
              </div>

              {/* Submit button */}
              <Button
                type="submit"
                color="primary"
                size="lg"
                className="mt-2"
                isLoading={isSubmitting || loading}
                isDisabled={isSubmitting || loading || !isPasswordValid}
              >
                {isSubmitting || loading ? 'Creating Account...' : 'Create Admin Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-default-500">
                Already have an account?{' '}
                <Link
                  href="/login"
                  color="primary"
                  className="font-medium"
                >
                  Sign In
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