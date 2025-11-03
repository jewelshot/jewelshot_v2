/**
 * Input Validation Utilities
 * Validates user inputs for security and cost control
 */

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate AI prompt
 * Checks length and content for security and cost control
 */
export function validatePrompt(prompt: string): ValidationResult {
  // Check if prompt exists
  if (!prompt || typeof prompt !== 'string') {
    return { valid: false, error: 'Prompt is required' };
  }

  // Trim whitespace
  const trimmedPrompt = prompt.trim();

  // Check minimum length
  if (trimmedPrompt.length < 3) {
    return { valid: false, error: 'Prompt must be at least 3 characters' };
  }

  // Check maximum length (to control costs)
  const MAX_PROMPT_LENGTH = 2000;
  if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
    return {
      valid: false,
      error: `Prompt too long. Maximum ${MAX_PROMPT_LENGTH} characters allowed`,
    };
  }

  // Check for malicious patterns
  const maliciousPatterns = [
    /(<script|javascript:|onerror=|onload=)/i, // XSS attempts
    /(eval\(|exec\(|system\()/i, // Code injection attempts
    /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b)/i, // SQL keywords
    /(\.\.\/|\.\.\\)/g, // Path traversal
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(trimmedPrompt)) {
      return {
        valid: false,
        error: 'Invalid content detected. Please remove special characters or code.',
      };
    }
  }

  // Check for excessive repetition (spam/abuse)
  const words = trimmedPrompt.split(/\s+/);
  const uniqueWords = new Set(words);
  const repetitionRatio = uniqueWords.size / words.length;

  if (words.length > 20 && repetitionRatio < 0.3) {
    return {
      valid: false,
      error: 'Prompt contains too much repetition. Please provide varied description.',
    };
  }

  return { valid: true };
}

/**
 * Validate negative prompt
 */
export function validateNegativePrompt(prompt: string): ValidationResult {
  if (!prompt) {
    return { valid: true }; // Negative prompt is optional
  }

  // Same validation as positive prompt but with lower length limit
  const MAX_LENGTH = 1000;

  if (prompt.length > MAX_LENGTH) {
    return {
      valid: false,
      error: `Negative prompt too long. Maximum ${MAX_LENGTH} characters allowed`,
    };
  }

  // Check for malicious patterns
  const maliciousPatterns = [
    /(<script|javascript:|onerror=|onload=)/i,
    /(eval\(|exec\(|system\()/i,
    /(\bDROP\b|\bDELETE\b|\bTRUNCATE\b)/i,
  ];

  for (const pattern of maliciousPatterns) {
    if (pattern.test(prompt)) {
      return {
        valid: false,
        error: 'Invalid content detected in negative prompt.',
      };
    }
  }

  return { valid: true };
}

/**
 * Sanitize prompt (remove potentially harmful content)
 */
export function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .substring(0, 2000); // Enforce max length
}

/**
 * Validate file upload
 */
export function validateFileUpload(file: File): ValidationResult {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file size (max 10MB)
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    return {
      valid: false,
      error: `File too large (${sizeMB}MB). Maximum size is 10MB`,
    };
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed`,
    };
  }

  // Check file extension matches MIME type
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mimeToExt: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
  };

  const expectedExts = mimeToExt[file.type];
  if (!expectedExts || !ext || !expectedExts.includes(ext)) {
    return {
      valid: false,
      error: 'File extension does not match file type',
    };
  }

  return { valid: true };
}

/**
 * Validate email
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  // Check length
  if (email.length > 254) {
    return { valid: false, error: 'Email too long' };
  }

  return { valid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password too long (max 128 characters)' };
  }

  // Check for at least one number, one letter
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return {
      valid: false,
      error: 'Password must contain at least one letter and one number',
    };
  }

  return { valid: true };
}
