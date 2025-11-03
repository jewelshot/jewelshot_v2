/**
 * Home/Landing Page
 * Will be built in Phase C
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export const metadata: Metadata = {
  title: 'Jewelshot | AI-Powered Jewelry Photography',
  description: 'Transform your jewelry photos with AI-powered editing and generation',
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0B] via-purple-950/20 to-[#0A0A0B]">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
                <span className="text-lg font-bold">💎</span>
              </div>
              <span className="text-xl font-bold">Jewelshot</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign in</Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary">Get started</Button>
              </Link>
            </div>
          </nav>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold text-white md:text-7xl">
              Transform Your
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Jewelry Photos
              </span>
              <br />
              with AI
            </h1>
            <p className="mt-6 text-xl text-gray-400 md:text-2xl">
              Professional jewelry photography powered by artificial intelligence.
              <br />
              Create stunning product images in seconds.
            </p>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button variant="primary" size="lg">
                  Start Creating Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Feature Preview */}
          <div className="mx-auto mt-24 max-w-5xl">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur">
              <p className="text-center text-gray-400">
                🚀 <strong>Phase B Complete!</strong> Authentication system is ready.
                <br />
                📸 <strong>Coming in Phase C:</strong> Landing page, Studio, and Gallery features.
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-12">
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
