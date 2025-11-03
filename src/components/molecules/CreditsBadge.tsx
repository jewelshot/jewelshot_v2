/**
 * Credits Badge (Molecule)
 * Display user's remaining credits
 */

'use client';

import Link from 'next/link';
import { useCredits } from '@/hooks/useCredits';

interface CreditsBadgeProps {
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CreditsBadge({ showLabel = true, size = 'md' }: CreditsBadgeProps) {
  const { credits, isLoading } = useCredits();

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (isLoading) {
    return (
      <div
        className={`flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 ${sizeClasses[size]}`}
      >
        <div className="h-4 w-16 animate-pulse rounded bg-white/10" />
      </div>
    );
  }

  const isLow = (credits || 0) <= 2;
  const isEmpty = (credits || 0) === 0;

  return (
    <Link
      href="/pricing"
      className={`flex items-center gap-2 rounded-full border transition-all ${
        isEmpty
          ? 'border-red-500/50 bg-red-500/20 hover:bg-red-500/30'
          : isLow
            ? 'border-yellow-500/50 bg-yellow-500/20 hover:bg-yellow-500/30'
            : 'border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20'
      } ${sizeClasses[size]}`}
    >
      <svg className={`${iconSizes[size]} text-yellow-400`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
          clipRule="evenodd"
        />
      </svg>
      <span
        className={`font-bold ${isEmpty ? 'text-red-300' : isLow ? 'text-yellow-300' : 'text-white'}`}
      >
        {credits || 0}
      </span>
      {showLabel && <span className="text-xs text-gray-400">credits</span>}
    </Link>
  );
}
