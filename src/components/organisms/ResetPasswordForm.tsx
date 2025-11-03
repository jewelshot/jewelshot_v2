/**
 * Reset Password Form (Organism)
 * Set new password after clicking reset link
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePassword } from '@/lib/auth/actions';
import { useFormValidation } from '@/hooks/useFormValidation';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';

export function ResetPasswordForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
    {
      password: '',
      confirmPassword: '',
    },
    {
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
      const result = await updatePassword(values.password);

      if (!result.success) {
        setServerError(result.error || 'Failed to update password');
      } else {
        // Redirect to login with success message
        router.push('/login?reset=success');
      }
    } catch (error) {
      setServerError('An unexpected error occurred');
      console.error('Password update error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Set new password</h1>
        <p className="mt-2 text-gray-400">Enter your new password below</p>
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
          label="New Password"
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
          label="Confirm New Password"
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

        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Update password
        </Button>
      </form>
    </div>
  );
}
