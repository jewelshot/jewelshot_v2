/**
 * Quick Mode Panel (Molecule)
 * Preset-based AI generation with real FAL.AI integration
 */

'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Button } from '@/components/atoms/Button';
import { generateAIImage } from '@/lib/ai/actions';
import { buildQuickPrompt } from '@/lib/ai/prompts';

const presets = [
  { id: 'white-background', name: 'White Background', icon: '⚪', description: 'Clean e-commerce' },
  { id: 'still-life', name: 'Still Life', icon: '🪨', description: 'Natural stone display' },
  { id: 'on-model', name: 'On Model', icon: '👤', description: 'Worn by model' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '🌿', description: 'Natural setting' },
  { id: 'luxury', name: 'Luxury', icon: '✨', description: 'High-end editorial' },
  { id: 'close-up', name: 'Close Up', icon: '🔍', description: 'Macro details' },
];

const jewelryTypes = [
  { value: 'ring', label: 'Ring' },
  { value: 'necklace', label: 'Necklace' },
  { value: 'bracelet', label: 'Bracelet' },
  { value: 'earring', label: 'Earring' },
];

const genders = [
  { value: 'women', label: 'Women' },
  { value: 'men', label: 'Men' },
];

export function QuickModePanel() {
  const { setIsGenerating, setGeneratedImageUrl, uploadedImage } = useCanvasStore();
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [jewelryType, setJewelryType] = useState('ring');
  const [gender, setGender] = useState('women');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedPreset) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Build prompt
      const { prompt, negativePrompt } = buildQuickPrompt({
        jewelryType,
        gender,
        presetId: selectedPreset,
        aspectRatio: '9:16',
      });

      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('prompt', prompt);
      formData.append('negativePrompt', negativePrompt);
      formData.append('mode', 'quick');
      formData.append('presetId', selectedPreset);
      formData.append('strength', '0.75');
      formData.append('guidanceScale', '7.5');
      formData.append(
        'metadata',
        JSON.stringify({
          jewelryType,
          gender,
          presetId: selectedPreset,
        })
      );

      // Generate image
      const result = await generateAIImage(formData);

      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
      } else {
        setError(result.error || 'Generation failed');
        console.error('[Quick Mode] Generation failed:', result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[Quick Mode] Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Jewelry Type */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Jewelry Type</label>
        <select
          value={jewelryType}
          onChange={(e) => setJewelryType(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
        >
          {jewelryTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">Model Gender</label>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-white focus:border-purple-500 focus:outline-none"
        >
          {genders.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </select>
      </div>

      {/* Presets */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">Choose Style</label>
        <div className="grid grid-cols-2 gap-3">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setSelectedPreset(preset.id)}
              className={`group relative rounded-xl border p-4 text-left transition-all ${
                selectedPreset === preset.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-purple-500/50 hover:bg-white/10'
              }`}
            >
              <div className="mb-2 text-2xl">{preset.icon}</div>
              <div className="text-sm font-medium text-white">{preset.name}</div>
              <div className="text-xs text-gray-400">{preset.description}</div>

              {/* Selected indicator */}
              {selectedPreset === preset.id && (
                <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600">
                  <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
          <p className="text-sm text-red-300">❌ {error}</p>
        </div>
      )}

      {/* Generate Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleGenerate}
        disabled={!uploadedImage || !selectedPreset}
      >
        🎨 Generate Photo
      </Button>
    </div>
  );
}
