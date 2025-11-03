/**
 * FAL.AI Client
 * Image-to-image generation utility
 */

import * as fal from '@fal-ai/serverless-client';

// Configure FAL client
fal.config({
  credentials: process.env.FAL_KEY,
});

export interface GenerateImageOptions {
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  strength?: number; // 0-1, how much to transform
  guidanceScale?: number; // 1-20, prompt adherence
  numImages?: number;
  seed?: number;
}

export interface GenerationResult {
  images: Array<{
    url: string;
    width: number;
    height: number;
    content_type: string;
  }>;
  timings: {
    inference: number;
  };
  seed: number;
  has_nsfw_concepts: boolean[];
}

/**
 * Generate image using FAL.AI
 * Model: flux-pro/v1.1-ultra (best quality)
 */
export async function generateImage(options: GenerateImageOptions): Promise<GenerationResult> {
  const {
    imageUrl,
    prompt,
    negativePrompt,
    strength = 0.75,
    guidanceScale = 7.5,
    numImages = 1,
    seed,
  } = options;

  try {
    const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
      input: {
        prompt,
        image_url: imageUrl,
        strength,
        guidance_scale: guidanceScale,
        num_images: numImages,
        seed: seed || Math.floor(Math.random() * 1000000),
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS') {
          console.log('[FAL.AI] Generation in progress...');
        }
      },
    });

    return result as GenerationResult;
  } catch (error) {
    console.error('[FAL.AI] Generation failed:', error);
    throw new Error(error instanceof Error ? error.message : 'AI generation failed');
  }
}

/**
 * Get queue status for a generation
 */
export async function getQueueStatus(requestId: string) {
  try {
    const status = await fal.queue.status('fal-ai/flux-pro/v1.1-ultra', {
      requestId,
      logs: true,
    });
    return status;
  } catch (error) {
    console.error('[FAL.AI] Failed to get queue status:', error);
    throw error;
  }
}
