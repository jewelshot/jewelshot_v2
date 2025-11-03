/**
 * Home/Landing Page
 * Main landing page with all sections
 */

import type { Metadata } from 'next';
import { LandingLayout } from '@/components/templates/LandingLayout';
import { Hero } from '@/components/organisms/Hero';
import { Features } from '@/components/organisms/Features';
import { HowItWorks } from '@/components/organisms/HowItWorks';
import { Stats } from '@/components/organisms/Stats';
import { Pricing } from '@/components/organisms/Pricing';
import { CTA } from '@/components/organisms/CTA';

export const metadata: Metadata = {
  title: 'Jewelshot | AI-Powered Jewelry Photography',
  description:
    'Transform your jewelry photos with AI. Create stunning, professional product images in seconds. No photoshoot required.',
  keywords: [
    'jewelry photography',
    'AI photo editing',
    'product photography',
    'jewelry images',
    'e-commerce photos',
  ],
  openGraph: {
    title: 'Jewelshot | AI-Powered Jewelry Photography',
    description: 'Transform your jewelry photos with AI-powered editing and generation',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <LandingLayout>
      <Hero />
      <Features />
      <HowItWorks />
      <Stats />
      <Pricing />
      <CTA />
    </LandingLayout>
  );
}
