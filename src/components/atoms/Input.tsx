/**
 * Input Component (Atom)
 * Reusable styled input field
 */

import type { InputHTMLAttributes } from 'react';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, id, type = 'text', ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-gray-200">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            // Base styles
            'w-full rounded-lg border bg-white/5 px-4 py-3 text-white',
            'placeholder:text-gray-500',
            'transition-all duration-200',
            // Focus styles
            'focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20',
            // Error styles
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
              : 'border-white/10 hover:border-white/20',
            // Disabled styles
            'disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
