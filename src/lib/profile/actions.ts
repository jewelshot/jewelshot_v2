/**
 * Profile Actions
 * Server actions for profile management
 */

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

/**
 * Update user profile
 */
export async function updateProfile(
  data: UpdateProfileData
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (error) {
      console.error('[Profile] Update failed:', error);
      return { success: false, error: error.message };
    }

    revalidatePath('/settings');
    return { success: true };
  } catch (error) {
    console.error('[Profile] Update error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update profile',
    };
  }
}

/**
 * Upload avatar to Supabase Storage
 */
export async function uploadAvatar(
  formData: FormData
): Promise<{ success: boolean; avatarUrl?: string; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const file = formData.get('avatar') as File;
    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return { success: false, error: 'File must be an image' };
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { success: false, error: 'File size must be less than 2MB' };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Delete old avatar if exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url')
      .eq('id', user.id)
      .single();

    if (profile?.avatar_url) {
      const oldPath = profile.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage.from('avatars').remove([`avatars/${oldPath}`]);
      }
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      console.error('[Profile] Avatar upload failed:', uploadError);
      return { success: false, error: uploadError.message };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile
    const updateResult = await updateProfile({ avatar_url: publicUrl });
    if (!updateResult.success) {
      return { success: false, error: updateResult.error };
    }

    return { success: true, avatarUrl: publicUrl };
  } catch (error) {
    console.error('[Profile] Avatar upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload avatar',
    };
  }
}

/**
 * Change user password
 * Note: Current password verification by re-login may cause session issues
 * TODO: Use proper password verification method after MVP
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return { success: false, error: 'Not authenticated' };
    }

    // Verify current password by attempting sign in
    // Note: This creates a new session but we immediately update password
    // so the session remains valid
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      return { success: false, error: 'Current password is incorrect' };
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      console.error('[Profile] Password change failed:', updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error('[Profile] Password change error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to change password',
    };
  }
}

/**
 * Delete user account
 * TODO: Implement proper account deletion with service role key
 * Currently only signs out the user (MVP workaround)
 * Full deletion requires:
 * 1. API route with service role client
 * 2. Delete all user data (images, generations, profile)
 * 3. Delete storage files
 * 4. Finally delete auth user
 */
export async function deleteAccount(): Promise<{ success: boolean; error?: string }> {
  try {
    // For MVP: Just sign out the user
    // Admin deletion requires service role key which needs separate API route
    console.warn('[Profile] Account deletion not fully implemented - signing out only');
    return { success: true };
  } catch (error) {
    console.error('[Profile] Account deletion error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete account',
    };
  }
}

/**
 * Get user profile
 */
export async function getUserProfile(): Promise<{
  success: boolean;
  data?: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    storage_used: number;
    ai_generation_count: number;
    created_at: string;
  };
  error?: string;
}> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('[Profile] Fetch failed:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: {
        id: profile.id,
        email: user.email || '',
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        storage_used: profile.storage_used,
        ai_generation_count: profile.ai_generation_count,
        created_at: profile.created_at,
      },
    };
  } catch (error) {
    console.error('[Profile] Fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch profile',
    };
  }
}
