/**
 * Zoom Controls (Molecule)
 * Canvas zoom control buttons
 */

'use client';

import { useCanvasStore } from '@/store/useCanvasStore';
import { IconButton } from '@/components/atoms/IconButton';

export function ZoomControls() {
  const { zoom, setZoom } = useCanvasStore();

  const handleZoomIn = () => setZoom(zoom + 10);
  const handleZoomOut = () => setZoom(zoom - 10);
  const handleZoomReset = () => setZoom(100);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-white/5 p-2">
      <IconButton
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
          </svg>
        }
        onClick={handleZoomOut}
        disabled={zoom <= 10}
        tooltip="Zoom out"
        size="sm"
      />

      <button
        onClick={handleZoomReset}
        className="min-w-[60px] rounded-md px-3 py-1.5 text-sm font-medium text-white hover:bg-white/10 transition-colors"
      >
        {Math.round(zoom)}%
      </button>

      <IconButton
        icon={
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        }
        onClick={handleZoomIn}
        disabled={zoom >= 500}
        tooltip="Zoom in"
        size="sm"
      />
    </div>
  );
}
