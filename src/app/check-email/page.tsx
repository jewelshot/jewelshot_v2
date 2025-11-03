/**
 * Check Email Page
 * Shown after signup to prompt email verification
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { AuthLayout } from '@/components/templates/AuthLayout';
import { Button } from '@/components/atoms/Button';

export const metadata: Metadata = {
  title: 'Check Your Email | Jewelshot',
  description: 'Verify your email address',
};

export default function CheckEmailPage() {
  return (
    <AuthLayout>
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
          <p className="mt-2 text-gray-400">We&apos;ve sent you a verification link</p>
          <p className="mt-4 text-sm text-gray-500">
            Click the link in the email to verify your account and start creating amazing jewelry
            photos.
          </p>
          <p className="mt-6 text-xs text-gray-600">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <Link href="/signup" className="text-purple-400 hover:text-purple-300">
              try signing up again
            </Link>
            .
          </p>
          <div className="mt-8">
            <Link href="/login">
              <Button variant="outline" fullWidth>
                Go to sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
