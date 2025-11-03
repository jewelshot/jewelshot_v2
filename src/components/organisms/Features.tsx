/**
 * Features Section (Organism)
 * Showcase main features
 */

import { FeatureCard } from '@/components/molecules/FeatureCard';

const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Generation',
    description:
      'Generate professional jewelry photos instantly using advanced AI models. No expensive equipment or photography skills needed.',
  },
  {
    icon: '⚡',
    title: 'Lightning Fast',
    description:
      'Create stunning images in seconds. Our optimized AI pipeline ensures quick turnaround without compromising quality.',
  },
  {
    icon: '🎨',
    title: 'Multiple Styles',
    description:
      'Choose from Quick, Selective, and Advanced modes. Customize every detail from lighting to background to poses.',
  },
  {
    icon: '💎',
    title: 'Jewelry Optimized',
    description:
      'Specialized models trained on jewelry photography. Perfect for rings, necklaces, bracelets, and earrings.',
  },
  {
    icon: '🖼️',
    title: 'Professional Presets',
    description:
      'One-click presets for e-commerce, lifestyle, luxury, and more. Get consistent, professional results every time.',
  },
  {
    icon: '📱',
    title: 'Export Ready',
    description:
      'Download high-resolution images optimized for Instagram, websites, or print. Multiple aspect ratios supported.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-32">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Everything You Need
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              To Create Stunning Photos
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Professional jewelry photography tools powered by cutting-edge AI technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
