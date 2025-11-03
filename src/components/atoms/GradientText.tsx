/**
 * Gradient Text Component (Atom)
 * Text with gradient background
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: ReactNode;
  from?: string;
  via?: string;
  to?: string;
  className?: string;
}

export function GradientText({
  children,
  from = 'from-purple-400',
  via = 'via-pink-400',
  to = 'to-purple-400',
  className,
}: GradientTextProps) {
  return (
    <span
      className={cn('bg-gradient-to-r bg-clip-text text-transparent', from, via, to, className)}
    >
      {children}
    </span>
  );
}
