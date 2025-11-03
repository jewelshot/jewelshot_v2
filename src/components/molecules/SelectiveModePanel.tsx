/**
 * Selective Mode Panel (Molecule)
 * Selective parameters with real FAL.AI integration
 */

'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Button } from '@/components/atoms/Button';
import { generateAIImage } from '@/lib/ai/actions';
import { buildSelectivePrompt } from '@/lib/ai/prompts';

const models = [
  { id: 'professional', name: 'Professional', emoji: '👔' },
  { id: 'elegant', name: 'Elegant', emoji: '👗' },
  { id: 'casual', name: 'Casual', emoji: '👕' },
  { id: 'formal', name: 'Formal', emoji: '🎩' },
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

const jewelryTypes = ['ring', 'necklace', 'bracelet', 'earring'];
const genders = ['women', 'men'];

export function SelectiveModePanel() {
  const { setIsGenerating, setGeneratedImageUrl, uploadedImage } = useCanvasStore();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [jewelryType, setJewelryType] = useState('ring');
  const [gender, setGender] = useState('women');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedModel || !selectedLocation || !selectedMood) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Build prompt
      const { prompt, negativePrompt } = buildSelectivePrompt({
        jewelryType,
        gender,
        model: selectedModel,
        location: selectedLocation,
        mood: selectedMood,
        aspectRatio: '9:16',
      });

      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('prompt', prompt);
      formData.append('negativePrompt', negativePrompt);
      formData.append('mode', 'selective');
      formData.append('strength', '0.7');
      formData.append('guidanceScale', '7.5');
      formData.append(
        'metadata',
        JSON.stringify({
          jewelryType,
          gender,
          model: selectedModel,
          location: selectedLocation,
          mood: selectedMood,
        })
      );

      // Generate image
      const result = await generateAIImage(formData);

      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
      } else {
        setError(result.error || 'Generation failed');
        console.error('[Selective Mode] Generation failed:', result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[Selective Mode] Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const canGenerate = uploadedImage && selectedModel && selectedLocation && selectedMood;

  return (
    <div className="space-y-6">
      {/* Jewelry Type & Gender */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">Jewelry</label>
          <select
            value={jewelryType}
            onChange={(e) => setJewelryType(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {jewelryTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium text-gray-400">Gender</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-purple-500 focus:outline-none"
          >
            {genders.map((g) => (
              <option key={g} value={g}>
                {g.charAt(0).toUpperCase() + g.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

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
        disabled={!canGenerate}
      >
        🎨 Generate Custom Style
      </Button>

      {!canGenerate && uploadedImage && (
        <p className="text-center text-xs text-gray-500">
          Select model, location, and mood to generate
        </p>
      )}
    </div>
  );
}
