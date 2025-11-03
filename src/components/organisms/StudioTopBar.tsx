/**
 * Studio Top Bar (Organism)
 * Top navigation and controls for Studio
 */

'use client';

import Link from 'next/link';
import { useCanvasStore } from '@/store/useCanvasStore';
import { IconButton } from '@/components/atoms/IconButton';
import { Button } from '@/components/atoms/Button';

export function StudioTopBar() {
  const { uploadedImage, generatedImageUrl, canvasImageUrl } = useCanvasStore();

  const handleDownload = () => {
    const imageUrl = generatedImageUrl || canvasImageUrl;
    if (!imageUrl) return;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `jewelshot-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <header className="flex items-center justify-between border-b border-white/10 bg-[#0A0A0B]/95 px-6 py-4 backdrop-blur-xl">
      {/* Left: Logo & Back */}
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-white transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-pink-600">
            <span className="text-lg font-bold">💎</span>
          </div>
          <span className="text-lg font-bold">Jewelshot</span>
        </Link>

        <div className="h-6 w-px bg-white/10" />

        <div className="text-sm text-gray-400">
          {uploadedImage ? uploadedImage.name : 'No image uploaded'}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Download Button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          disabled={!canvasImageUrl && !generatedImageUrl}
        >
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

        {/* Account */}
        <Link href="/login">
          <IconButton
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            }
            tooltip="Account"
          />
        </Link>
      </div>
    </header>
  );
}
