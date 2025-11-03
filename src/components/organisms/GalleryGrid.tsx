/**
 * Gallery Grid (Organism)
 * Responsive grid layout for gallery images
 */

'use client';

import { useState } from 'react';
import type { GalleryImage } from '@/lib/gallery/queries';
import { ImageCard } from '@/components/atoms/ImageCard';
import { ImageDetailModal } from '@/components/molecules/ImageDetailModal';
import { EmptyState } from '@/components/atoms/EmptyState';

interface GalleryGridProps {
  images: GalleryImage[];
  onDelete: (imageId: string) => void;
  onDownload: (imageUrl: string, fileName: string) => void;
  isLoading?: boolean;
}

export function GalleryGrid({ images, onDelete, onDownload, isLoading = false }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <EmptyState
        icon={
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        }
        title="No images yet"
        description="Start creating stunning jewelry photos with AI. Upload your first image in the Studio!"
        actionLabel="Go to Studio"
        actionHref="/studio"
      />
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => {
          const generation = image.ai_generations?.[0];
          const mode = generation?.parameters
            ? (generation.parameters as Record<string, unknown>).mode
            : 'unknown';

          return (
            <ImageCard
              key={image.id}
              imageUrl={image.edited_url || image.original_url}
              title={image.file_name}
              date={image.created_at}
              mode={mode as string}
              onClick={() => setSelectedImage(image)}
              onDelete={() => onDelete(image.id)}
              onDownload={() => onDownload(image.edited_url || image.original_url, image.file_name)}
            />
          );
        })}
      </div>

      {/* Detail Modal */}
      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDelete={() => {
            onDelete(selectedImage.id);
            setSelectedImage(null);
          }}
          onDownload={() =>
            onDownload(
              selectedImage.edited_url || selectedImage.original_url,
              selectedImage.file_name
            )
          }
        />
      )}
    </>
  );
}
