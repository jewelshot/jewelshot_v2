/**
 * Rate Limiting
 * Simple in-memory rate limiter for AI generation
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetAt: number;
  };
}

const store: RateLimitStore = {};

export interface RateLimitConfig {
  max: number; // Maximum requests
  windowMs: number; // Time window in milliseconds
}

/**
 * Check if user has exceeded rate limit
 */
export function checkRateLimit(
  userId: string,
  config: RateLimitConfig = { max: 10, windowMs: 60 * 60 * 1000 } // 10 per hour default
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const userLimit = store[userId];

  // No existing limit or expired - allow and create new
  if (!userLimit || now > userLimit.resetAt) {
    store[userId] = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: now + config.windowMs,
    };
  }

  // Existing limit - check count
  if (userLimit.count >= config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: userLimit.resetAt,
    };
  }

  // Increment count
  userLimit.count += 1;
  return {
    allowed: true,
    remaining: config.max - userLimit.count,
    resetAt: userLimit.resetAt,
  };
}

/**
 * Reset rate limit for user (admin use)
 */
export function resetRateLimit(userId: string): void {
  delete store[userId];
}

/**
 * Get rate limit info for user
 */
export function getRateLimitInfo(
  userId: string,
  config: RateLimitConfig = { max: 10, windowMs: 60 * 60 * 1000 }
): { count: number; remaining: number; resetAt: number } {
  const now = Date.now();
  const userLimit = store[userId];

  if (!userLimit || now > userLimit.resetAt) {
    return {
      count: 0,
      remaining: config.max,
      resetAt: now + config.windowMs,
    };
  }

  return {
    count: userLimit.count,
    remaining: config.max - userLimit.count,
    resetAt: userLimit.resetAt,
  };
}
