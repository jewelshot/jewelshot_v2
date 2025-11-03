/**
 * Image Card (Atom)
 * Gallery image card component
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ImageCardProps {
  imageUrl: string;
  title: string;
  date?: string;
  mode?: string;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
}

export function ImageCard({
  imageUrl,
  title,
  date,
  mode,
  isSelected = false,
  onClick,
  onDelete,
  onDownload,
}: ImageCardProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl border transition-all duration-300',
        'hover:scale-[1.02] hover:shadow-2xl',
        isSelected
          ? 'border-purple-500 ring-2 ring-purple-500/50'
          : 'border-white/10 hover:border-purple-500/50'
      )}
    >
      {/* Image */}
      <div
        onClick={onClick}
        className="relative aspect-[3/4] cursor-pointer overflow-hidden bg-black/50"
      >
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Mode badge */}
        {mode && (
          <div className="absolute left-3 top-3 rounded-lg bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="border-t border-white/10 bg-white/5 p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 flex-1 text-sm font-medium text-white" title={title}>
            {title}
          </h3>
        </div>

        {date && <p className="mb-3 text-xs text-gray-400">{formatDate(date)}</p>}

        {/* Actions */}
        <div className="flex gap-2">
          {onDownload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload();
              }}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white transition-colors hover:bg-white/10"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </button>
          )}

          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (window.confirm('Delete this image?')) {
                  onDelete();
                }
              }}
              className="flex items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-400 transition-colors hover:bg-red-500/20"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
