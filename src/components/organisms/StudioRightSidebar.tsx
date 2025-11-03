/**
 * Studio Right Sidebar (Organism)
 * AI generation modes and controls
 */

'use client';

import { useCanvasStore } from '@/store/useCanvasStore';
import { ModeSelector } from '@/components/molecules/ModeSelector';
import { QuickModePanel } from '@/components/molecules/QuickModePanel';
import { SelectiveModePanel } from '@/components/molecules/SelectiveModePanel';
import { AdvancedModePanel } from '@/components/molecules/AdvancedModePanel';

export function StudioRightSidebar() {
  const { mode } = useCanvasStore();

  return (
    <aside className="flex w-96 flex-col border-l border-white/10 bg-[#0A0A0B]/50">
      {/* Header */}
      <div className="border-b border-white/10 p-6">
        <h2 className="mb-2 text-lg font-semibold text-white">AI Generation</h2>
        <p className="text-sm text-gray-400">Transform your jewelry photo with AI</p>
      </div>

      {/* Mode Selector */}
      <div className="border-b border-white/10 p-6">
        <ModeSelector />
      </div>

      {/* Mode Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {mode === 'quick' && <QuickModePanel />}
        {mode === 'selective' && <SelectiveModePanel />}
        {mode === 'advanced' && <AdvancedModePanel />}
      </div>

      {/* Footer Info */}
      <div className="border-t border-white/10 p-4">
        <p className="text-center text-xs text-gray-500">
          {mode === 'quick' && '⚡ Quick mode uses preset styles'}
          {mode === 'selective' && '🎨 Selective mode for custom combinations'}
          {mode === 'advanced' && '⚙️ Advanced mode for full control'}
        </p>
      </div>
    </aside>
  );
}
