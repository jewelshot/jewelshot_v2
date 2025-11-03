/**
 * Pricing Page
 * Buy credits for AI generation
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/organisms/AppHeader';
import { Button } from '@/components/atoms/Button';
import { useCredits } from '@/hooks/useCredits';

const creditPackages = [
  {
    id: 'starter',
    name: 'Starter Pack',
    credits: 10,
    price: 9.99,
    popular: false,
    features: ['10 AI generations', 'All presets', 'HD quality', '7 days support'],
  },
  {
    id: 'pro',
    name: 'Pro Pack',
    credits: 50,
    price: 39.99,
    popular: true,
    features: ['50 AI generations', 'All presets', 'HD quality', 'Priority support', 'Save 20%'],
  },
  {
    id: 'business',
    name: 'Business Pack',
    credits: 150,
    price: 99.99,
    popular: false,
    features: [
      '150 AI generations',
      'All presets',
      'HD quality',
      'Priority support',
      'Save 33%',
      'Bulk processing',
    ],
  },
];

export default function PricingPage() {
  const { credits, isLoading } = useCredits();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const handlePurchase = async (packageId: string) => {
    setSelectedPackage(packageId);
    // TODO: Implement Stripe checkout
    alert('Stripe integration coming soon!');
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B]">
      <AppHeader />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">Buy Credits</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Purchase credits to generate stunning AI jewelry photos. Each credit = 1 AI generation.
          </p>
          {!isLoading && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-6 py-3">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-lg font-semibold text-white">
                You have <span className="text-purple-400">{credits || 0}</span> credits
              </span>
            </div>
          )}
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {creditPackages.map((pkg) => {
            const pricePerCredit = (pkg.price / pkg.credits).toFixed(2);
            const isPurchasing = selectedPackage === pkg.id;

            return (
              <div
                key={pkg.id}
                className={`relative overflow-hidden rounded-2xl border p-8 transition-all ${
                  pkg.popular
                    ? 'border-purple-500/50 bg-gradient-to-b from-purple-500/10 to-transparent shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                    : 'border-white/10 bg-white/5 hover:border-purple-500/30 hover:bg-white/[0.08]'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 px-3 py-1 text-xs font-bold text-white">
                    POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold text-white">{pkg.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-white">${pkg.price}</span>
                    <span className="text-sm text-gray-400">/ {pkg.credits} credits</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-400">${pricePerCredit} per credit</p>
                </div>

                <ul className="mb-8 space-y-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3 text-sm text-gray-300">
                      <svg
                        className="h-5 w-5 flex-shrink-0 text-green-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={pkg.popular ? 'primary' : 'outline'}
                  size="lg"
                  fullWidth
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={isPurchasing}
                >
                  {isPurchasing ? 'Processing...' : `Buy ${pkg.credits} Credits`}
                </Button>
              </div>
            );
          })}
        </div>

        {/* FAQ / Info */}
        <div className="mt-16 rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="mb-6 text-2xl font-bold text-white">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 font-semibold text-white">What are credits?</h3>
              <p className="text-sm text-gray-400">
                Credits are used to generate AI images. Each AI generation costs 1 credit. Credits
                never expire and can be used anytime.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">Can I get a refund?</h3>
              <p className="text-sm text-gray-400">
                Yes! We offer a 7-day money-back guarantee. If you&apos;re not satisfied, contact us
                for a full refund.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">Do credits expire?</h3>
              <p className="text-sm text-gray-400">
                No, credits never expire. You can use them whenever you&apos;re ready.
              </p>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-white">Need more credits?</h3>
              <p className="text-sm text-gray-400">
                For bulk purchases (500+ credits), please contact us at{' '}
                <a href="mailto:sales@jewelshot.ai" className="text-purple-400 hover:underline">
                  sales@jewelshot.ai
                </a>{' '}
                for enterprise pricing.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400">
            Need help choosing a plan?{' '}
            <Link href="/studio" className="text-purple-400 hover:underline">
              Try our free credits first
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
