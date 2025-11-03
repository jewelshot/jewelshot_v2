/**
 * Image Uploader (Molecule)
 * Drag & drop image upload component
 */

'use client';

import { useCallback, useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onUpload?: (file: File) => void;
  maxSizeMB?: number;
}

export function ImageUploader({ onUpload, maxSizeMB = 10 }: ImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { setUploadedImage, setCanvasImageUrl } = useCanvasStore();

  const handleFile = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`File size must be less than ${maxSizeMB}MB`);
        return;
      }

      // Create object URL for preview
      const url = URL.createObjectURL(file);
      setUploadedImage(file);
      setCanvasImageUrl(url);
      onUpload?.(file);
    },
    [maxSizeMB, onUpload, setUploadedImage, setCanvasImageUrl]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={cn(
        'flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all',
        isDragOver
          ? 'border-purple-500 bg-purple-500/10'
          : 'border-white/20 hover:border-white/30 hover:bg-white/5'
      )}
    >
      {/* Upload Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/20">
        <svg
          className="h-8 w-8 text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="mb-6 text-center">
        <p className="mb-1 text-lg font-medium text-white">
          {isDragOver ? 'Drop image here' : 'Upload jewelry image'}
        </p>
        <p className="text-sm text-gray-400">Drag & drop or click to browse (max {maxSizeMB}MB)</p>
      </div>

      {/* Browse Button */}
      <label className="cursor-pointer">
        <input type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
        <div className="rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700">
          Browse Files
        </div>
      </label>

      {/* Supported Formats */}
      <p className="mt-4 text-xs text-gray-500">Supports: JPG, PNG, WEBP</p>
    </div>
  );
}
