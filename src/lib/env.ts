/**
 * Environment Validation
 * Validate required environment variables
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'FAL_KEY',
] as const;

const optionalEnvVars = ['NEXT_PUBLIC_APP_URL'] as const;

export function validateEnv(): { valid: boolean; missing: string[] } {
  const missing: string[] = [];

  for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  }

  if (missing.length > 0) {
    console.error('[ENV] Missing required environment variables:', missing);
    return { valid: false, missing };
  }

  // Warn about optional variables
  for (const varName of optionalEnvVars) {
    if (!process.env[varName]) {
      console.warn(`[ENV] Optional environment variable not set: ${varName}`);
    }
  }

  return { valid: true, missing: [] };
}

export function getEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (!value && !fallback) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value || fallback || '';
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
  const { valid, missing } = validateEnv();
  if (!valid) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please check your .env.local file.'
    );
  }
}
