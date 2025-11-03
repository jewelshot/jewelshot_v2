/**
 * Stats Section (Organism)
 * Display impressive statistics
 */

import { StatCard } from '@/components/molecules/StatCard';

const stats = [
  { value: '10K', suffix: '+', label: 'Photos Generated' },
  { value: '500', suffix: '+', label: 'Happy Customers' },
  { value: '99', suffix: '%', label: 'Satisfaction Rate' },
  { value: '<5', suffix: 's', label: 'Average Generation Time' },
];

export function Stats() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 backdrop-blur-sm md:p-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Trusted by Jewelry Businesses Worldwide
            </h2>
            <p className="text-gray-400">Join thousands of satisfied customers</p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat) => (
              <StatCard
                key={stat.label}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
