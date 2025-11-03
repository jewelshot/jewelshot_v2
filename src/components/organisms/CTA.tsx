/**
 * CTA Section (Organism)
 * Final call-to-action before footer
 */

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { GradientText } from '@/components/atoms/GradientText';

export function CTA() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 p-12 backdrop-blur-sm md:p-20">
          {/* Background decoration */}
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-64 w-64 translate-x-1/2 translate-y-1/2 rounded-full bg-pink-500/20 blur-3xl" />

          {/* Content */}
          <div className="relative text-center">
            <h2 className="mb-6 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              Ready to Transform Your
              <br />
              <GradientText>Jewelry Photography?</GradientText>
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-300">
              Join thousands of jewelry businesses creating stunning product photos with AI.
              <br />
              Start for free, no credit card required.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button variant="primary" size="lg" className="group min-w-[220px]">
                  Get Started Free
                  <svg
                    className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="secondary" size="lg" className="min-w-[220px]">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
