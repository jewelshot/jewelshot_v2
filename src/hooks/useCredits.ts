/**
 * useCredits Hook
 * Client-side hook for managing credit state
 */

'use client';

import { useState, useEffect } from 'react';
import { getUserCredits } from '@/lib/credits/actions';

export function useCredits() {
  const [credits, setCredits] = useState<number | null>(null);
  const [plan, setPlan] = useState<string>('free');
  const [isLoading, setIsLoading] = useState(true);

  const refreshCredits = async () => {
    setIsLoading(true);
    const result = await getUserCredits();
    if (result.success && result.data) {
      setCredits(result.data.credits);
      setPlan(result.data.plan);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Defer state updates to avoid cascading renders
    const timer = setTimeout(() => {
      refreshCredits();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return {
    credits,
    plan,
    isLoading,
    hasCredits: (credits || 0) > 0,
    refreshCredits,
  };
}
