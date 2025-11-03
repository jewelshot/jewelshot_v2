/**
 * Login Form (Organism)
 * Complete login form with validation and OAuth
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from '@/lib/auth/actions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { SocialAuthButtons } from '@/components/molecules/SocialAuthButtons';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      email: '',
      password: '',
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
      password: {
        required: true,
        minLength: 8,
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
      const result = await signIn({
        email: values.email,
        password: values.password,
      });

      if (!result.success) {
        setServerError(result.error || 'Failed to sign in');
      }
      // On success, signIn() will redirect automatically
    } catch (error) {
      setServerError('An unexpected error occurred');
      console.error('Sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        <p className="mt-2 text-gray-400">Sign in to your account to continue</p>
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

      {/* Email/Password Form */}
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

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          placeholder="••••••••"
          value={values.password}
          error={touched.password ? errors.password : undefined}
          onChange={(e) => handleChange('password', e.target.value)}
          onBlur={() => handleBlur('password')}
          disabled={isLoading}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center text-gray-400">
            <input
              type="checkbox"
              className="mr-2 h-4 w-4 rounded border-white/10 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0"
            />
            Remember me
          </label>
          <Link
            href="/forgot-password"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Sign in
        </Button>
      </form>

      {/* Sign up link */}
      <p className="text-center text-sm text-gray-400">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="font-medium text-purple-400 hover:text-purple-300 transition-colors"
        >
          Sign up for free
        </Link>
      </p>
    </div>
  );
}
