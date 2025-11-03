/**
 * Authentication Server Actions
 * Server-side auth operations for Next.js Server Actions
 */

'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// =====================================================
// SIGN UP
// =====================================================

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    userId?: string;
    email?: string;
  };
}

export async function signUp(formData: SignUpData): Promise<AuthResult> {
  const supabase = await createClient();

  const { email, password, fullName } = formData;

  // Validate input
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters',
    };
  }

  // Sign up user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Failed to create user',
    };
  }

  return {
    success: true,
    data: {
      userId: data.user.id,
      email: data.user.email,
    },
  };
}

// =====================================================
// SIGN IN
// =====================================================

export interface SignInData {
  email: string;
  password: string;
}

export async function signIn(formData: SignInData): Promise<AuthResult> {
  const supabase = await createClient();

  const { email, password } = formData;

  // Validate input
  if (!email || !password) {
    return {
      success: false,
      error: 'Email and password are required',
    };
  }

  // Sign in user
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      error: 'Invalid email or password',
    };
  }

  if (!data.user) {
    return {
      success: false,
      error: 'Failed to sign in',
    };
  }

  revalidatePath('/', 'layout');
  redirect('/studio');
}

// =====================================================
// SIGN OUT
// =====================================================

export async function signOut(): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}

// =====================================================
// OAUTH SIGN IN
// =====================================================

export type OAuthProvider = 'google' | 'github';

export async function signInWithOAuth(provider: OAuthProvider): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  if (data.url) {
    redirect(data.url);
  }

  return {
    success: false,
    error: 'Failed to initialize OAuth',
  };
}

// =====================================================
// PASSWORD RESET
// =====================================================

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = await createClient();

  if (!newPassword || newPassword.length < 8) {
    return {
      success: false,
      error: 'Password must be at least 8 characters',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

// =====================================================
// EMAIL VERIFICATION
// =====================================================

export async function resendVerificationEmail(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  if (!email) {
    return {
      success: false,
      error: 'Email is required',
    };
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
  };
}

// =====================================================
// GET CURRENT USER
// =====================================================

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

// =====================================================
// GET SESSION
// =====================================================

export async function getSession() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}
