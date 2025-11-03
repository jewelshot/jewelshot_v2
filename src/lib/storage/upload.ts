/**
 * Image Upload Utilities
 * Upload images to Supabase Storage
 */

import { createClient } from '@/lib/supabase/server';

export interface UploadResult {
  url: string;
  path: string;
  bucket: string;
}

/**
 * Upload image file to Supabase Storage
 * Returns public URL for the uploaded file
 * Enforces storage limits (1GB for free plan)
 */
export async function uploadImageToStorage(
  file: File,
  bucket: string = 'images',
  userId?: string
): Promise<UploadResult> {
  try {
    const supabase = await createClient();

    // Storage limit enforcement (1GB = 1073741824 bytes)
    const STORAGE_LIMIT = 1073741824; // 1GB in bytes

    if (userId) {
      // Get user's current storage usage
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('storage_used')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error('[Storage] Failed to check storage:', profileError);
        // Continue anyway - don't block upload on profile fetch error
      } else if (profile) {
        const currentUsage = profile.storage_used || 0;
        const newUsage = currentUsage + file.size;

        // Check if upload would exceed limit
        if (newUsage > STORAGE_LIMIT) {
          const usedGB = (currentUsage / 1073741824).toFixed(2);
          const limitGB = (STORAGE_LIMIT / 1073741824).toFixed(2);
          throw new Error(
            `Storage limit exceeded. You've used ${usedGB}GB of ${limitGB}GB. Please delete some images or upgrade your plan.`
          );
        }
      }
    }

    // Validate file size (max 10MB per file)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(2);
      throw new Error(`File too large (${sizeMB}MB). Maximum file size is 10MB.`);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`Invalid file type: ${file.type}. Only JPEG, PNG, and WebP are allowed.`);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const ext = file.name.split('.').pop();
    const filename = `${userId || 'anonymous'}_${timestamp}_${randomStr}.${ext}`;
    const path = `uploads/${filename}`;

    // Upload file
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('[Storage] Upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(data.path);

    return {
      url: publicUrl,
      path: data.path,
      bucket,
    };
  } catch (error) {
    console.error('[Storage] Upload error:', error);
    throw error;
  }
}

/**
 * Delete image from Supabase Storage
 */
export async function deleteImageFromStorage(
  path: string,
  bucket: string = 'images'
): Promise<void> {
  try {
    const supabase = await createClient();

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      console.error('[Storage] Delete failed:', error);
      throw new Error(`Delete failed: ${error.message}`);
    }
  } catch (error) {
    console.error('[Storage] Delete error:', error);
    throw error;
  }
}

/**
 * Convert File to base64 (for client-side preview)
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert base64 to Blob
 */
export function base64ToBlob(base64: string, mimeType: string = 'image/png'): Blob {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}
