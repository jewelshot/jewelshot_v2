/**
 * How It Works Section (Organism)
 * Step-by-step process explanation
 */

import { StepCard } from '@/components/molecules/StepCard';

const steps = [
  {
    number: 1,
    title: 'Upload Your Photo',
    description: 'Start with any jewelry photo. Our AI works with any image quality or angle.',
  },
  {
    number: 2,
    title: 'Choose Your Style',
    description: 'Select from Quick Mode presets or customize every detail in Advanced Mode.',
  },
  {
    number: 3,
    title: 'Generate & Download',
    description: 'AI creates your perfect photo in seconds. Download and use immediately.',
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-0 top-1/2 h-px w-full bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">How It Works</h2>
          <p className="mx-auto max-w-2xl text-xl text-gray-400">
            Create professional jewelry photos in three simple steps
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step) => (
            <StepCard
              key={step.number}
              number={step.number}
              title={step.title}
              description={step.description}
            />
          ))}
        </div>

        {/* Visual separator */}
        <div className="relative mt-16 hidden md:block">
          <div className="absolute left-[16.66%] top-1/2 w-[16.66%] border-t-2 border-dashed border-purple-500/30" />
          <div className="absolute left-[50%] top-1/2 w-[16.66%] border-t-2 border-dashed border-purple-500/30" />
        </div>
      </div>
    </section>
  );
}
