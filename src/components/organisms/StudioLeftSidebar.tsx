/**
 * Studio Left Sidebar (Organism)
 * Canvas tools and controls
 */

'use client';

import { useCanvasStore } from '@/store/useCanvasStore';
import { Slider } from '@/components/atoms/Slider';
import { ZoomControls } from '@/components/molecules/ZoomControls';
import { IconButton } from '@/components/atoms/IconButton';

export function StudioLeftSidebar() {
  const { rotation, setRotation, uploadedImage, setCanvasImageUrl, setUploadedImage } =
    useCanvasStore();

  const handleReset = () => {
    setRotation(0);
    if (window.confirm('Reset to original image?')) {
      setCanvasImageUrl(null);
      setUploadedImage(null);
    }
  };

  return (
    <aside className="flex w-64 flex-col gap-6 border-r border-white/10 bg-[#0A0A0B]/50 p-6">
      {/* Section: Upload */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">Upload</h3>
        <label className="block">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setUploadedImage(file);
                setCanvasImageUrl(url);
              }
            }}
          />
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {uploadedImage ? 'Change Image' : 'Upload Image'}
          </div>
        </label>
      </div>

      {/* Section: Zoom */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">Zoom</h3>
        <ZoomControls />
      </div>

      {/* Section: Rotation */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-white">Rotation</h3>
        <Slider
          value={rotation}
          min={0}
          max={360}
          step={1}
          suffix="°"
          onChange={(e) => setRotation(Number(e.target.value))}
        />
      </div>

      {/* Section: Actions */}
      <div className="mt-auto space-y-2">
        <button
          onClick={handleReset}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
      </div>
    </aside>
  );
}
