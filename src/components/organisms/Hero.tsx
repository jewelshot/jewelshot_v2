/**
 * Hero Section (Organism)
 * Landing page hero with CTA
 */

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { GradientText } from '@/components/atoms/GradientText';

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      {/* Animated background blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-purple-500/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-96 w-96 animate-pulse rounded-full bg-pink-500/10 blur-3xl [animation-delay:1s]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <Badge variant="purple" size="md">
              ✨ Powered by AI · 10,000+ Photos Created
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-7xl">
            Transform Your
            <br />
            <GradientText>Jewelry Photos</GradientText>
            <br />
            in Seconds
          </h1>

          {/* Subheading */}
          <p className="mb-12 text-xl text-gray-400 md:text-2xl">
            Professional AI-powered jewelry photography.
            <br />
            Create stunning product images without expensive photoshoots.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="group min-w-[200px]">
                Start Creating Free
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
            <Link href="#features">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Free plan available
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </div>
          </div>

          {/* Demo preview placeholder */}
          <div className="mt-16">
            <div className="relative mx-auto max-w-5xl">
              <div className="aspect-video rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 backdrop-blur-sm">
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mb-4 text-6xl">💎</div>
                    <p className="text-gray-500">
                      Product demo coming soon
                      <br />
                      <span className="text-sm">Screenshot of Studio interface will be here</span>
                    </p>
                  </div>
                </div>
              </div>
              {/* Glow effect */}
              <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 opacity-50 blur-2xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
