/**
 * Credit Management Actions
 * Server actions for managing user credits
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Get user's current credit balance
 */
export async function getUserCredits(): Promise<ActionResult<{ credits: number; plan: string }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('credits, plan')
      .eq('id', user.id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        credits: (data as any).credits || 0,
        plan: (data as any).plan || 'free',
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Deduct one credit from user's balance
 */
export async function deductCredit(): Promise<ActionResult<{ remainingCredits: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Call the database function
    const { data, error } = await (supabase.rpc as any)('deduct_credit', {
      user_id: user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data === -1) {
      return { success: false, error: 'Insufficient credits' };
    }

    revalidatePath('/studio');
    revalidatePath('/gallery');

    return {
      success: true,
      data: { remainingCredits: data },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Add credits to user's balance
 */
export async function addCredits(amount: number): Promise<ActionResult<{ newBalance: number }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (amount <= 0) {
      return { success: false, error: 'Invalid credit amount' };
    }

    // Call the database function
    const { data, error } = await (supabase.rpc as any)('add_credits', {
      user_id: user.id,
      amount,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data === -1) {
      return { success: false, error: 'Failed to add credits' };
    }

    revalidatePath('/studio');
    revalidatePath('/gallery');
    revalidatePath('/settings');

    return {
      success: true,
      data: { newBalance: data },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Check if user has available credits
 */
export async function hasAvailableCredits(): Promise<ActionResult<{ hasCredits: boolean }>> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await (supabase.rpc as any)('has_credits', {
      user_id: user.id,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: { hasCredits: Boolean(data) },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get credit purchase history
 */
export async function getPurchaseHistory(): Promise<
  ActionResult<
    Array<{
      id: string;
      amount: number;
      credits: number;
      status: string;
      created_at: string;
    }>
  >
> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('purchases')
      .select('id, amount, credits, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
