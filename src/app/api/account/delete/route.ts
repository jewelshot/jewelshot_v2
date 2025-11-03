/**
 * Account Deletion API Route
 * Uses service role key for admin operations
 * Implements full cascade delete (GDPR compliant)
 */

import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // Get current user from session
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const userId = user.id;

    // Create admin client with service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Step 1: Get all user's images to delete from storage
    const { data: images } = await supabaseAdmin
      .from('images')
      .select('storage_path')
      .eq('user_id', userId);

    // Step 2: Delete all files from storage
    if (images && images.length > 0) {
      const imagePaths = images.map((img) => img.storage_path);
      await supabaseAdmin.storage.from('images').remove(imagePaths);
    }

    // Step 3: Get user's avatar to delete
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('avatar_url')
      .eq('id', userId)
      .single();

    if (profile?.avatar_url) {
      const avatarPath = profile.avatar_url.split('/').pop();
      if (avatarPath) {
        await supabaseAdmin.storage.from('avatars').remove([`avatars/${avatarPath}`]);
      }
    }

    // Step 4: Delete database records (cascading will handle related records)
    // Order matters: child tables first, then profile
    await supabaseAdmin.from('ai_generations').delete().eq('user_id', userId);
    await supabaseAdmin.from('images').delete().eq('user_id', userId);
    await supabaseAdmin.from('projects').delete().eq('user_id', userId);
    await supabaseAdmin.from('purchases').delete().eq('user_id', userId);
    await supabaseAdmin.from('profiles').delete().eq('id', userId);

    // Step 5: Delete auth user (must be last)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('[Account] Failed to delete auth user:', deleteError);
      return NextResponse.json(
        { success: false, error: 'Failed to delete account' },
        { status: 500 }
      );
    }

    // Step 6: Sign out the user
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('[Account] Deletion error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'An error occurred while deleting your account',
      },
      { status: 500 }
    );
  }
}
