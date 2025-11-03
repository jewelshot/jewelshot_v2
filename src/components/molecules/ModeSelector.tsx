/**
 * Mode Selector (Molecule)
 * Tab-based mode switching component
 */

'use client';

import type { GenerationMode } from '@/store/useCanvasStore';
import { useCanvasStore } from '@/store/useCanvasStore';
import { cn } from '@/lib/utils';

const modes = [
  { id: 'quick', label: 'Quick', icon: '⚡' },
  { id: 'selective', label: 'Selective', icon: '🎨' },
  { id: 'advanced', label: 'Advanced', icon: '⚙️' },
] as const;

export function ModeSelector() {
  const { mode, setMode } = useCanvasStore();

  return (
    <div className="flex gap-2 rounded-lg bg-white/5 p-1">
      {modes.map((modeItem) => (
        <button
          key={modeItem.id}
          onClick={() => setMode(modeItem.id as GenerationMode)}
          className={cn(
            'flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all',
            mode === modeItem.id
              ? 'bg-purple-600 text-white shadow-lg'
              : 'text-gray-400 hover:bg-white/5 hover:text-white'
          )}
        >
          <span className="mr-1.5">{modeItem.icon}</span>
          {modeItem.label}
        </button>
      ))}
    </div>
  );
}
