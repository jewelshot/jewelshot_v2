/**
 * Error Handling Utilities
 * Sanitizes error messages for production
 */

/**
 * Sanitize error message for user display
 * Hides internal details in production
 */
export function sanitizeError(error: unknown): string {
  const isProd = process.env.NODE_ENV === 'production';

  if (error instanceof Error) {
    // In production, hide internal error details
    if (isProd) {
      // Map common errors to user-friendly messages
      if (error.message.includes('fetch')) {
        return 'Network error. Please check your connection and try again.';
      }
      if (error.message.includes('unauthorized') || error.message.includes('auth')) {
        return 'Authentication error. Please sign in again.';
      }
      if (error.message.includes('rate limit')) {
        return error.message; // Rate limit messages are safe to show
      }
      if (error.message.includes('credit')) {
        return error.message; // Credit messages are safe to show
      }
      if (error.message.includes('storage')) {
        return error.message; // Storage messages are safe to show
      }

      // Generic error for everything else
      return 'An error occurred. Please try again or contact support if the problem persists.';
    }

    // In development, show full error
    return error.message;
  }

  // Unknown error type
  return isProd ? 'An unexpected error occurred.' : `Unknown error: ${String(error)}`;
}

/**
 * Log error safely (console in dev, proper logging in prod)
 */
export function logError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === 'production') {
    // In production, use structured logging
    // TODO: Send to logging service (Sentry, LogRocket, etc.)
    console.error(`[${context}]`, {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });
  } else {
    // In development, full console.error
    console.error(`[${context}]`, error);
  }
}
