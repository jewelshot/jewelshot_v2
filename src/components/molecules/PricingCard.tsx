/**
 * Pricing Card Component (Molecule)
 * Displays a pricing plan
 */

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  ctaText: string;
  ctaLink: string;
  popular?: boolean;
}

export function PricingCard({
  name,
  price,
  period = '/month',
  description,
  features,
  ctaText,
  ctaLink,
  popular = false,
}: PricingCardProps) {
  return (
    <div className="relative">
      {/* Popular badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <Badge variant="purple">Most Popular</Badge>
        </div>
      )}

      {/* Card */}
      <div
        className={`relative rounded-2xl border p-8 ${
          popular
            ? 'border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10'
            : 'border-white/10 bg-white/5'
        }`}
      >
        {/* Header */}
        <div className="mb-6">
          <h3 className="mb-2 text-2xl font-bold text-white">{name}</h3>
          <p className="text-gray-400">{description}</p>
        </div>

        {/* Price */}
        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-bold text-white">{price}</span>
            {period && <span className="text-gray-400">{period}</span>}
          </div>
        </div>

        {/* CTA */}
        <Link href={ctaLink}>
          <Button variant={popular ? 'primary' : 'secondary'} fullWidth size="lg" className="mb-6">
            {ctaText}
          </Button>
        </Link>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-gray-300">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Glow effect for popular */}
      {popular && (
        <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-purple-500/30 opacity-50 blur-xl" />
      )}
    </div>
  );
}
