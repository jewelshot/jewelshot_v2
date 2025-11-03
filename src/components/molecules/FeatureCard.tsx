/**
 * Feature Card Component (Molecule)
 * Displays a single feature with icon and description
 */

import type { ReactNode } from 'react';

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative">
      {/* Card */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-white/[0.05]">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 text-2xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>

        {/* Content */}
        <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400">{description}</p>
      </div>

      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 -z-10 rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-pink-500/0 opacity-0 blur transition-opacity duration-300 group-hover:from-purple-500/20 group-hover:via-pink-500/20 group-hover:to-purple-500/20 group-hover:opacity-100" />
    </div>
  );
}
