/**
 * Selective Mode Panel (Molecule)
 * Simplified selective parameters for MVP
 */

'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Button } from '@/components/atoms/Button';

const models = [
  { id: 'model-1', name: 'Professional', emoji: '👔' },
  { id: 'model-2', name: 'Elegant', emoji: '👗' },
  { id: 'model-3', name: 'Casual', emoji: '👕' },
  { id: 'model-4', name: 'Formal', emoji: '🎩' },
];

const locations = [
  { id: 'studio', name: 'Studio', emoji: '🏢' },
  { id: 'outdoor', name: 'Outdoor', emoji: '🌳' },
  { id: 'home', name: 'Home', emoji: '🏠' },
  { id: 'elegant', name: 'Elegant', emoji: '✨' },
];

const moods = [
  { id: 'bright', name: 'Bright', emoji: '☀️' },
  { id: 'moody', name: 'Moody', emoji: '🌙' },
  { id: 'natural', name: 'Natural', emoji: '🌿' },
  { id: 'dramatic', name: 'Dramatic', emoji: '🎭' },
];

export function SelectiveModePanel() {
  const { setIsGenerating, setGeneratedImageUrl, canvasImageUrl } = useCanvasStore();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!canvasImageUrl || !selectedModel || !selectedLocation || !selectedMood) return;

    setIsGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      setGeneratedImageUrl(canvasImageUrl);
      setIsGenerating(false);
    }, 3000);
  };

  const canGenerate = canvasImageUrl && selectedModel && selectedLocation && selectedMood;

  return (
    <div className="space-y-6">
      {/* Model Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">Model Style</label>
        <div className="grid grid-cols-2 gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedModel === model.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="mb-1 text-xl">{model.emoji}</div>
              <div className="text-sm text-white">{model.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">Location</label>
        <div className="grid grid-cols-2 gap-2">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => setSelectedLocation(location.id)}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedLocation === location.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="mb-1 text-xl">{location.emoji}</div>
              <div className="text-sm text-white">{location.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood Selection */}
      <div>
        <label className="mb-3 block text-sm font-medium text-gray-300">Mood</label>
        <div className="grid grid-cols-2 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`rounded-lg border p-3 text-left transition-all ${
                selectedMood === mood.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="mb-1 text-xl">{mood.emoji}</div>
              <div className="text-sm text-white">{mood.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleGenerate}
        disabled={!canGenerate}
      >
        🎨 Generate Custom Style
      </Button>

      {!canGenerate && canvasImageUrl && (
        <p className="text-center text-xs text-gray-500">
          Select model, location, and mood to generate
        </p>
      )}
    </div>
  );
}
