/**
 * 404 Not Found Page
 */

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0A0A0B] p-6">
      <div className="max-w-md text-center">
        {/* 404 Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-purple-500/20">
            <svg
              className="h-10 w-10 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-4xl font-bold text-white">404</h1>
        <h2 className="mb-3 text-xl font-semibold text-white">Page not found</h2>

        {/* Description */}
        <p className="mb-6 text-gray-400">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
          deleted.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/" className="flex-1">
            <Button variant="secondary" fullWidth>
              Go Home
            </Button>
          </Link>
          <Link href="/studio" className="flex-1">
            <Button variant="primary" fullWidth>
              Go to Studio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
