/**
 * Canvas Component (Organism)
 * Main image display and manipulation area
 * MVP: Simple image preview with zoom/pan (Fabric.js for Phase 3)
 */

'use client';

import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { ImageUploader } from '@/components/molecules/ImageUploader';
import { cn } from '@/lib/utils';

export function Canvas() {
  const { canvasImageUrl, generatedImageUrl, zoom, isGenerating } = useCanvasStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // Display generated image if available, otherwise uploaded image
  const displayImage = generatedImageUrl || canvasImageUrl;

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      if (canvasImageUrl && canvasImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(canvasImageUrl);
      }
    };
  }, [canvasImageUrl]);

  return (
    <div
      ref={containerRef}
      className="relative flex h-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#1A1A1B]"
    >
      {/* No Image State */}
      {!displayImage && !isGenerating && (
        <div className="max-w-md p-8">
          <ImageUploader />
        </div>
      )}

      {/* Image Display */}
      {displayImage && !isGenerating && (
        <div
          className="relative transition-transform duration-200"
          style={{
            transform: `scale(${zoom / 100})`,
          }}
        >
          <img
            src={displayImage}
            alt="Canvas preview"
            className="max-h-[70vh] max-w-full rounded-lg object-contain"
            draggable={false}
          />
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />

          {/* Text */}
          <div className="text-center">
            <p className="mb-1 text-lg font-medium text-white">Generating...</p>
            <p className="text-sm text-gray-400">Creating your perfect jewelry photo</p>
          </div>
        </div>
      )}

      {/* Watermark/Info */}
      {displayImage && !isGenerating && (
        <div className="absolute bottom-4 right-4 rounded-lg bg-black/50 px-3 py-2 text-xs text-gray-300 backdrop-blur-sm">
          {generatedImageUrl ? '✨ AI Generated' : '📸 Original'}
        </div>
      )}
    </div>
  );
}
