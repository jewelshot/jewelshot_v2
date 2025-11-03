/**
 * Landing Layout (Template)
 * Layout for landing/marketing pages with header and footer
 */

import type { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Footer } from '@/components/organisms/Footer';

interface LandingLayoutProps {
  children: ReactNode;
}

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl">
          <div className="container mx-auto px-4">
            <nav className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                  <span className="text-lg font-bold">💎</span>
                </div>
                <span className="text-xl font-bold">Jewelshot</span>
              </Link>

              {/* Navigation */}
              <div className="hidden items-center gap-8 md:flex">
                <Link
                  href="#features"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Features
                </Link>
                <Link
                  href="#pricing"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Pricing
                </Link>
                <Link
                  href="/gallery"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Gallery
                </Link>
                <Link
                  href="/docs"
                  className="text-sm text-gray-300 transition-colors hover:text-white"
                >
                  Docs
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
