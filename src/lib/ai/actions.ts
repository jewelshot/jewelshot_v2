/**
 * AI Generation Server Actions
 * Server-side AI image generation
 */

'use server';

import { generateImage } from '@/lib/fal/client';
import { uploadImageToStorage } from '@/lib/storage/upload';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface GenerateOptions {
  prompt: string;
  negativePrompt?: string;
  strength?: number;
  guidanceScale?: number;
  mode: 'quick' | 'selective' | 'advanced';
  presetId?: string;
  metadata?: Record<string, unknown>;
}

export interface GenerateResult {
  success: boolean;
  imageUrl?: string;
  generationId?: string;
  error?: string;
}

/**
 * Generate AI image from uploaded file
 */
export async function generateAIImage(formData: FormData): Promise<GenerateResult> {
  try {
    const file = formData.get('file') as File;
    const prompt = formData.get('prompt') as string;
    const negativePrompt = (formData.get('negativePrompt') as string) || undefined;
    const strength = parseFloat((formData.get('strength') as string) || '0.75');
    const guidanceScale = parseFloat((formData.get('guidanceScale') as string) || '7.5');
    const mode = (formData.get('mode') as string) || 'quick';
    const presetId = (formData.get('presetId') as string) || undefined;
    const metadata = formData.get('metadata') ? JSON.parse(formData.get('metadata') as string) : {};

    // Validate inputs
    if (!file) {
      return { success: false, error: 'No file provided' };
    }
    if (!prompt) {
      return { success: false, error: 'No prompt provided' };
    }

    const supabase = createClient();

    // Get current user (optional for MVP)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Step 1: Upload original image to Supabase Storage
    console.log('[AI] Uploading original image...');
    const uploadResult = await uploadImageToStorage(file, 'images', userId);

    // Step 2: Generate AI image using FAL.AI
    console.log('[AI] Generating AI image...');
    const generation = await generateImage({
      imageUrl: uploadResult.url,
      prompt,
      negativePrompt,
      strength,
      guidanceScale,
      numImages: 1,
    });

    const generatedImageUrl = generation.images[0]?.url;
    if (!generatedImageUrl) {
      return { success: false, error: 'No image generated' };
    }

    // Step 3: Download generated image and upload to Supabase
    console.log('[AI] Saving generated image...');
    const generatedImageResponse = await fetch(generatedImageUrl);
    const generatedImageBlob = await generatedImageResponse.blob();
    const generatedFile = new File([generatedImageBlob], 'generated.png', {
      type: 'image/png',
    });

    const generatedUploadResult = await uploadImageToStorage(generatedFile, 'images', userId);

    // Step 4: Save to database (if user is logged in)
    let generationId: string | undefined;
    if (userId) {
      const { data: imageRecord, error: imageError } = await supabase
        .from('images')
        .insert({
          user_id: userId,
          original_url: uploadResult.url,
          edited_url: generatedUploadResult.url,
          storage_path: generatedUploadResult.path,
          file_name: file.name,
          file_size: file.size,
          metadata: {
            originalPath: uploadResult.path,
            ...metadata,
          },
        })
        .select()
        .single();

      if (imageError) {
        console.error('[AI] Failed to save image record:', imageError);
      }

      // Log AI generation
      if (imageRecord) {
        const { data: genRecord } = await supabase
          .from('ai_generations')
          .insert({
            user_id: userId,
            image_id: imageRecord.id,
            model_name: 'flux-pro/v1.1-ultra',
            prompt,
            negative_prompt: negativePrompt,
            parameters: {
              strength,
              guidanceScale,
              seed: generation.seed,
              mode,
              presetId,
            },
            status: 'completed',
            inference_time: generation.timings.inference,
          })
          .select()
          .single();

        if (genRecord) {
          generationId = genRecord.id;
        }
      }
    }

    // Revalidate paths
    revalidatePath('/studio');
    if (userId) {
      revalidatePath('/gallery');
    }

    console.log('[AI] ✅ Generation successful!');
    return {
      success: true,
      imageUrl: generatedUploadResult.url,
      generationId,
    };
  } catch (error) {
    console.error('[AI] Generation failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Generation failed',
    };
  }
}

/**
 * Get user's generation history
 */
export async function getGenerationHistory(limit: number = 10) {
  try {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const { data, error } = await supabase
      .from('ai_generations')
      .select('*, images(*)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('[AI] Failed to fetch history:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('[AI] History fetch error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch history',
    };
  }
}
