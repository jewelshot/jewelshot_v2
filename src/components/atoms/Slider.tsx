/**
 * Slider Component (Atom)
 * Reusable range input slider
 */

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  suffix?: string;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  showValue = true,
  suffix = '',
  className,
  ...props
}: SliderProps) {
  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="mb-2 flex items-center justify-between text-sm">
          <label className="text-gray-300">{label}</label>
          {showValue && (
            <span className="font-medium text-white">
              {value}
              {suffix}
            </span>
          )}
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className={cn(
          'h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10',
          '[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4',
          '[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full',
          '[&::-webkit-slider-thumb]:bg-purple-600 [&::-webkit-slider-thumb]:cursor-pointer',
          '[&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-purple-500',
          '[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4',
          '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
          '[&::-moz-range-thumb]:bg-purple-600 [&::-moz-range-thumb]:cursor-pointer'
        )}
        {...props}
      />
    </div>
  );
}
