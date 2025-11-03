/**
 * Forgot Password Form (Organism)
 * Request password reset email
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { requestPasswordReset } from '@/lib/auth/actions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      email: '',
    },
    {
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
      const result = await requestPasswordReset(values.email);

      if (!result.success) {
        setServerError(result.error || 'Failed to send reset email');
      } else {
        setShowSuccess(true);
      }
    } catch (error) {
      setServerError('An unexpected error occurred');
      console.error('Password reset error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
            <svg
              className="h-8 w-8 text-purple-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Check your email</h1>
          <p className="mt-2 text-gray-400">
            We&apos;ve sent a password reset link to <strong>{values.email}</strong>
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Click the link in the email to reset your password. The link will expire in 1 hour.
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button variant="outline" fullWidth>
                Back to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Forgot your password?</h1>
        <p className="mt-2 text-gray-400">Enter your email and we&apos;ll send you a reset link</p>
      </div>

      {/* Server Error */}
      {serverError && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
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

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Send reset link
        </Button>
      </form>

      {/* Back to login */}
      <p className="text-center text-sm text-gray-400">
        <Link
          href="/login"
          className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}
