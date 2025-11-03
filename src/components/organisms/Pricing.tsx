/**
 * Pricing Section (Organism)
 * Display pricing plans
 */

import { PricingCard } from '@/components/molecules/PricingCard';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for testing and small projects',
    features: [
      '10 AI generations per month',
      'Quick Mode presets',
      'Standard resolution',
      '3 aspect ratios',
      'Community support',
    ],
    ctaText: 'Start Free',
    ctaLink: '/signup',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professional jewelry businesses',
    features: [
      '500 AI generations per month',
      'All modes (Quick, Selective, Advanced)',
      'High resolution (4K)',
      'All aspect ratios',
      'Custom presets',
      'Priority generation',
      'Email support',
      'Commercial license',
    ],
    ctaText: 'Start Pro Trial',
    ctaLink: '/signup?plan=pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large teams and agencies',
    features: [
      'Unlimited AI generations',
      'API access',
      'Custom model training',
      'White-label solution',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 priority support',
      'SLA guarantee',
    ],
    ctaText: 'Contact Sales',
    ctaLink: '/contact',
    popular: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              period={plan.period}
              description={plan.description}
              features={plan.features}
              ctaText={plan.ctaText}
              ctaLink={plan.ctaLink}
              popular={plan.popular}
            />
          ))}
        </div>

        {/* FAQ Note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            All plans include 14-day money-back guarantee. No questions asked.
          </p>
        </div>
      </div>
    </section>
  );
}
