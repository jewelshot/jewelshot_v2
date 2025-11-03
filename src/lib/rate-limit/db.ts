/**
 * Database-backed Rate Limiting
 * Works in serverless environment (Vercel)
 * Uses ai_generations table for tracking
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface RateLimitConfig {
  maxRequests: number; // Maximum requests allowed
  windowMinutes: number; // Time window in minutes
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
}

/**
 * Check if user has exceeded rate limit
 * Uses ai_generations table to count recent generations
 */
export async function checkRateLimit(
  userId: string,
  config: RateLimitConfig = { maxRequests: 10, windowMinutes: 60 }
): Promise<RateLimitResult> {
  try {
    const supabase = await createClient();

    // Calculate time window
    const windowStart = new Date();
    windowStart.setMinutes(windowStart.getMinutes() - config.windowMinutes);

    // Count generations in the time window
    const { data, error, count } = await supabase
      .from('ai_generations')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', windowStart.toISOString());

    if (error) {
      console.error('[RateLimit] Database query failed:', error);
      // Fail open (allow request) on database error to avoid blocking users
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000),
        error: 'Rate limit check failed',
      };
    }

    const requestCount = count || 0;
    const remaining = Math.max(0, config.maxRequests - requestCount);
    const allowed = requestCount < config.maxRequests;

    // Calculate reset time (end of current window)
    const resetAt = new Date(Date.now() + config.windowMinutes * 60 * 1000);

    return {
      allowed,
      remaining,
      resetAt,
    };
  } catch (error) {
    console.error('[RateLimit] Unexpected error:', error);
    // Fail open on unexpected errors
    return {
      allowed: true,
      remaining: config.maxRequests,
      resetAt: new Date(Date.now() + config.windowMinutes * 60 * 1000),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get user's rate limit status without checking
 */
export async function getRateLimitStatus(
  userId: string,
  config: RateLimitConfig = { maxRequests: 10, windowMinutes: 60 }
): Promise<RateLimitResult> {
  return checkRateLimit(userId, config);
}
