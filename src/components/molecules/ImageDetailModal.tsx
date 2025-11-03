/**
 * Image Detail Modal (Molecule)
 * Full image preview with metadata and actions
 */

'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { GalleryImage } from '@/lib/gallery/queries';
import { Button } from '@/components/atoms/Button';

interface ImageDetailModalProps {
  image: GalleryImage;
  onClose: () => void;
  onDelete: () => void;
  onDownload: () => void;
}

export function ImageDetailModal({ image, onClose, onDelete, onDownload }: ImageDetailModalProps) {
  const generation = image.ai_generations?.[0];

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0B] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Image Preview */}
        <div className="relative flex-1 overflow-auto bg-black/50 p-8">
          <div className="relative mx-auto h-full max-w-2xl">
            <Image
              src={image.edited_url || image.original_url}
              alt={image.file_name}
              width={800}
              height={1200}
              className="h-full w-full rounded-lg object-contain"
              priority
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex w-96 flex-col border-l border-white/10 bg-white/5">
          {/* Header */}
          <div className="border-b border-white/10 p-6">
            <h2 className="mb-2 text-lg font-semibold text-white">Image Details</h2>
            <p className="text-sm text-gray-400">{formatDate(image.created_at)}</p>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6 overflow-y-auto p-6">
            {/* File Info */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">File Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{image.file_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Size:</span>
                  <span className="text-white">{formatFileSize(image.file_size)}</span>
                </div>
              </div>
            </div>

            {/* Generation Info */}
            {generation && (
              <>
                <div className="border-t border-white/10 pt-6">
                  <h3 className="mb-3 text-sm font-semibold text-white">AI Generation</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Model:</span>
                      <span className="text-white">{generation.model_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mode:</span>
                      <span className="text-white">
                        {generation.parameters
                          ? (generation.parameters as Record<string, unknown>).mode
                          : 'N/A'}
                      </span>
                    </div>
                    {generation.inference_time && (
                      <div className="flex justify-between">
                        <span className="text-gray-400">Time:</span>
                        <span className="text-white">{generation.inference_time}s</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Prompt */}
                {generation.prompt && (
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="mb-3 text-sm font-semibold text-white">Prompt</h3>
                    <p className="rounded-lg bg-white/5 p-3 text-xs leading-relaxed text-gray-300">
                      {generation.prompt.length > 300
                        ? `${generation.prompt.slice(0, 300)}...`
                        : generation.prompt}
                    </p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3 border-t border-white/10 p-6">
            <Button variant="primary" size="lg" fullWidth onClick={onDownload}>
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </Button>

            <Button
              variant="danger"
              size="lg"
              fullWidth
              onClick={() => {
                if (window.confirm('Delete this image? This action cannot be undone.')) {
                  onDelete();
                }
              }}
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
