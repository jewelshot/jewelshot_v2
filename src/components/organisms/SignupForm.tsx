/**
 * Signup Form (Organism)
 * Complete signup form with validation and OAuth
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signUp } from '@/lib/auth/actions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SocialAuthButtons } from '@/components/molecules/SocialAuthButtons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    {
      fullName: {
        required: true,
        minLength: 2,
        maxLength: 50,
      },
      email: {
        required: true,
        pattern: EMAIL_REGEX,
        custom: (value) => {
          if (!EMAIL_REGEX.test(value)) {
            return 'Please enter a valid email address';
          }
          return null;
        },
      },
      password: {
        required: true,
        minLength: 8,
        custom: (value) => {
          if (!/[A-Z]/.test(value)) {
            return 'Password must contain at least one uppercase letter';
          }
          if (!/[a-z]/.test(value)) {
            return 'Password must contain at least one lowercase letter';
          }
          if (!/[0-9]/.test(value)) {
            return 'Password must contain at least one number';
          }
          return null;
        },
      },
      confirmPassword: {
        required: true,
        custom: (value) => {
          if (value !== values.password) {
            return 'Passwords do not match';
          }
          return null;
        },
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validateAll()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signUp({
        email: values.email,
        password: values.password,
        fullName: values.fullName,
      });

      if (!result.success) {
        setServerError(result.error || 'Failed to create account');
      } else {
        setShowSuccess(true);
        // Redirect to check email page after 2 seconds
        setTimeout(() => {
          router.push('/check-email');
        }, 2000);
      }
    } catch (error) {
      setServerError('An unexpected error occurred');
      console.error('Sign up error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
            <svg
              className="h-8 w-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Check your email</h1>
          <p className="mt-2 text-gray-400">
            We&apos;ve sent a verification link to <strong>{values.email}</strong>
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Click the link in the email to verify your account and get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create your account</h1>
        <p className="mt-2 text-gray-400">Start creating amazing jewelry photos</p>
      </div>

      {/* Social Auth */}
      <div>
        <SocialAuthButtons />
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#0A0A0B] px-4 text-gray-500">Or continue with email</span>
        </div>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          type="text"
          name="fullName"
          autoComplete="name"
          placeholder="John Doe"
          value={values.fullName}
          error={touched.fullName ? errors.fullName : undefined}
          onChange={(e) => handleChange('fullName', e.target.value)}
          onBlur={() => handleBlur('fullName')}
          disabled={isLoading}
        />

        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={values.email}
          error={touched.email ? errors.email : undefined}
          onChange={(e) => handleChange('email', e.target.value)}
          onBlur={() => handleBlur('email')}
          disabled={isLoading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.password}
          error={touched.password ? errors.password : undefined}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          disabled={isLoading}
        />

        <Input
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={values.confirmPassword}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          onChange={(e) => handleChange('confirmPassword', e.target.value)}
          onBlur={() => handleBlur('confirmPassword')}
          disabled={isLoading}
        />

        <div className="text-xs text-gray-500">
          <p>Password must contain:</p>
          <ul className="mt-1 space-y-1 pl-4">
            <li className={values.password.length >= 8 ? 'text-green-500' : ''}>
              • At least 8 characters
            </li>
            <li className={/[A-Z]/.test(values.password) ? 'text-green-500' : ''}>
              • One uppercase letter
            </li>
            <li className={/[a-z]/.test(values.password) ? 'text-green-500' : ''}>
              • One lowercase letter
            </li>
            <li className={/[0-9]/.test(values.password) ? 'text-green-500' : ''}>• One number</li>
          </ul>
        </div>

        <div className="text-xs text-gray-500">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </Link>
          .
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Create account
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm text-gray-400">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
