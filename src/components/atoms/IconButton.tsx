/**
 * Icon Button (Atom)
 * Reusable icon-based button
 */

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  tooltip?: string;
}

export function IconButton({
  icon,
  variant = 'default',
  size = 'md',
  tooltip,
  className,
  ...props
}: IconButtonProps) {
  const variants = {
    default: 'bg-white/10 hover:bg-white/20 text-white',
    primary: 'bg-purple-600 hover:bg-purple-700 text-white',
    ghost: 'hover:bg-white/10 text-gray-400 hover:text-white',
  };

  const sizes = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-10 w-10 text-base',
    lg: 'h-12 w-12 text-lg',
  };

  return (
    <button
      type="button"
      title={tooltip}
      className={cn(
        'inline-flex items-center justify-center rounded-lg transition-all duration-200',
        'disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {icon}
    </button>
  );
}
