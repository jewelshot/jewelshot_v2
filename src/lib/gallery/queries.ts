/**
 * Gallery Queries
 * Fetch and manage user images for gallery
 */

'use server';

import { createClient } from '@/lib/supabase/server';

export interface GalleryImage {
  id: string;
  original_url: string;
  edited_url: string | null;
  file_name: string;
  file_size: number;
  storage_path: string;
  created_at: string;
  metadata: Record<string, unknown> | null;
  ai_generations?: Array<{
    id: string;
    model_name: string;
    prompt: string;
    negative_prompt: string | null;
    parameters: Record<string, unknown> | null;
    status: string;
    inference_time: number | null;
    created_at: string;
  }>;
}

export interface GalleryFilters {
  jewelryType?: string;
  mode?: string;
  searchQuery?: string;
  sortBy?: 'newest' | 'oldest';
  limit?: number;
  offset?: number;
}

/**
 * Get user's gallery images with filters
 */
export async function getGalleryImages(
  filters: GalleryFilters = {}
): Promise<{ success: boolean; data?: GalleryImage[]; error?: string; count?: number }> {
  try {
    const supabase = createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { jewelryType, mode, searchQuery, sortBy = 'newest', limit = 20, offset = 0 } = filters;

    // Build query
    let query = supabase
      .from('images')
      .select(
        `
        *,
        ai_generations (
          id,
          model_name,
          prompt,
          negative_prompt,
          parameters,
          status,
          inference_time,
          created_at
        )
      `,
        { count: 'exact' }
      )
      .eq('user_id', user.id);

    // Apply filters
    if (jewelryType) {
      query = query.contains('metadata', { jewelryType });
    }

    if (mode) {
      query = query.contains('metadata', { mode });
    }

    // Search in file name or prompt
    if (searchQuery) {
      query = query.or(
        `file_name.ilike.%${searchQuery}%,ai_generations.prompt.ilike.%${searchQuery}%`
      );
    }

    // Sort
    const ascending = sortBy === 'oldest';
    query = query.order('created_at', { ascending });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      console.error('[Gallery] Failed to fetch images:', error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      data: data as GalleryImage[],
      count: count || 0,
    };
  } catch (error) {
    console.error('[Gallery] Query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch images',
    };
  }
}

/**
 * Get single image with full details
 */
export async function getImageById(
  imageId: string
): Promise<{ success: boolean; data?: GalleryImage; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('images')
      .select(
        `
        *,
        ai_generations (
          id,
          model_name,
          prompt,
          negative_prompt,
          parameters,
          status,
          inference_time,
          created_at
        )
      `
      )
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('[Gallery] Failed to fetch image:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as GalleryImage };
  } catch (error) {
    console.error('[Gallery] Query error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch image',
    };
  }
}

/**
 * Delete image and its storage files
 */
export async function deleteImage(imageId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    // Get image details first
    const { data: image } = await supabase
      .from('images')
      .select('storage_path, metadata')
      .eq('id', imageId)
      .eq('user_id', user.id)
      .single();

    if (!image) {
      return { success: false, error: 'Image not found' };
    }

    // Delete from database (cascade will delete ai_generations)
    const { error: deleteError } = await supabase
      .from('images')
      .delete()
      .eq('id', imageId)
      .eq('user_id', user.id);

    if (deleteError) {
      console.error('[Gallery] Failed to delete image:', deleteError);
      return { success: false, error: deleteError.message };
    }

    // Delete from storage
    if (image.storage_path) {
      await supabase.storage.from('images').remove([image.storage_path]);
    }

    // Delete original if path exists in metadata
    const originalPath = (image.metadata as Record<string, unknown>)?.originalPath;
    if (originalPath && typeof originalPath === 'string') {
      await supabase.storage.from('images').remove([originalPath]);
    }

    return { success: true };
  } catch (error) {
    console.error('[Gallery] Delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete image',
    };
  }
}

/**
 * Get gallery statistics
 */
export async function getGalleryStats(): Promise<{
  success: boolean;
  data?: {
    totalImages: number;
    totalGenerations: number;
    storageUsed: number;
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

    // Get profile with storage info
    const { data: profile } = await supabase
      .from('profiles')
      .select('storage_used')
      .eq('id', user.id)
      .single();

    // Count images
    const { count: imagesCount } = await supabase
      .from('images')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Count generations
    const { count: generationsCount } = await supabase
      .from('ai_generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    return {
      success: true,
      data: {
        totalImages: imagesCount || 0,
        totalGenerations: generationsCount || 0,
        storageUsed: profile?.storage_used || 0,
      },
    };
  } catch (error) {
    console.error('[Gallery] Stats error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch stats',
    };
  }
}
