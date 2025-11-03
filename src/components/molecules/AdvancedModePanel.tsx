/**
 * Advanced Mode Panel (Molecule)
 * Advanced parameters with custom prompts (MVP version)
 */

'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Button } from '@/components/atoms/Button';
import { Slider } from '@/components/atoms/Slider';

export function AdvancedModePanel() {
  const { setIsGenerating, setGeneratedImageUrl, canvasImageUrl } = useCanvasStore();
  const [customPrompt, setCustomPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [creativity, setCreativity] = useState(50);

  const handleGenerate = async () => {
    if (!canvasImageUrl) return;

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedImageUrl(canvasImageUrl);
      setIsGenerating(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Custom Prompt */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Custom Prompt
          <span className="ml-1 text-xs text-gray-500">(Optional)</span>
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe additional details or style..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
          rows={4}
        />
      </div>

      {/* Negative Prompt */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Negative Prompt
          <span className="ml-1 text-xs text-gray-500">(Optional)</span>
        </label>
        <textarea
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
          placeholder="What to avoid in the image..."
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
          rows={3}
        />
      </div>

      {/* Creativity Slider */}
      <div>
        <Slider
          label="Creativity Level"
          value={creativity}
          min={0}
          max={100}
          onChange={(e) => setCreativity(Number(e.target.value))}
        />
        <p className="mt-1 text-xs text-gray-500">Higher values = more creative interpretations</p>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Advanced mode gives you full control. Describe your vision in
          detail for best results.
        </p>
      </div>

      {/* Generate Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleGenerate}
        disabled={!canvasImageUrl}
      >
        🚀 Generate Advanced
      </Button>
    </div>
  );
}
