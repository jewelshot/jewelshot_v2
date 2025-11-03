/**
 * Auth Layout (Template)
 * Centered layout for auth pages with branding
 */

import type { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-purple-950/20 to-[#0A0A0B]">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative flex min-h-screen flex-col">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
              <span className="text-lg font-bold">💎</span>
            </div>
            <span className="text-xl font-bold">Jewelshot</span>
          </Link>
        </header>

        {/* Main content */}
        <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <Link href="/terms" className="hover:text-gray-400 transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">
              Privacy
            </Link>
            <Link href="/help" className="hover:text-gray-400 transition-colors">
              Help
            </Link>
            <Link href="/contact" className="hover:text-gray-400 transition-colors">
              Contact
            </Link>
          </div>
          <p className="mt-4 text-center text-xs text-gray-600">
            © 2024 Jewelshot. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
