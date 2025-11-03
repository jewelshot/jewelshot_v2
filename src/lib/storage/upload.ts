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
 */
export async function uploadImageToStorage(
  file: File,
  bucket: string = 'images',
  userId?: string
): Promise<UploadResult> {
  try {
    const supabase = createClient();

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
    const supabase = createClient();

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
