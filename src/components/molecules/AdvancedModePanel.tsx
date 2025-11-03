/**
 * Advanced Mode Panel (Molecule)
 * Advanced parameters with real FAL.AI integration
 */

'use client';

import { useState } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Button } from '@/components/atoms/Button';
import { Slider } from '@/components/atoms/Slider';
import { generateAIImage } from '@/lib/ai/actions';
import { buildAdvancedPrompt } from '@/lib/ai/prompts';

const jewelryTypes = ['ring', 'necklace', 'bracelet', 'earring'];
const genders = ['women', 'men'];

export function AdvancedModePanel() {
  const { setIsGenerating, setGeneratedImageUrl, uploadedImage } = useCanvasStore();
  const [customPrompt, setCustomPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [strength, setStrength] = useState(75);
  const [guidanceScale, setGuidanceScale] = useState(75);
  const [jewelryType, setJewelryType] = useState('ring');
  const [gender, setGender] = useState('women');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!uploadedImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Build prompt
      const { prompt: basePrompt, negativePrompt: baseNegative } = buildAdvancedPrompt({
        jewelryType,
        gender,
        customPrompt,
        aspectRatio: '9:16',
      });

      // Combine base negative with custom negative
      const finalNegativePrompt = negativePrompt
        ? `${baseNegative}, ${negativePrompt}`
        : baseNegative;

      // Create FormData
      const formData = new FormData();
      formData.append('file', uploadedImage);
      formData.append('prompt', basePrompt);
      formData.append('negativePrompt', finalNegativePrompt);
      formData.append('mode', 'advanced');
      formData.append('strength', (strength / 100).toString());
      formData.append('guidanceScale', (guidanceScale / 10).toString());
      formData.append(
        'metadata',
        JSON.stringify({
          jewelryType,
          gender,
          customPrompt: customPrompt || 'none',
          strength: strength / 100,
          guidanceScale: guidanceScale / 10,
        })
      );

      // Generate image
      const result = await generateAIImage(formData);

      if (result.success && result.imageUrl) {
        setGeneratedImageUrl(result.imageUrl);
      } else {
        setError(result.error || 'Generation failed');
        console.error('[Advanced Mode] Generation failed:', result.error);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      console.error('[Advanced Mode] Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

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

      {/* Strength Slider */}
      <div>
        <Slider
          label="Transformation Strength"
          value={strength}
          min={0}
          max={100}
          onChange={(e) => setStrength(Number(e.target.value))}
          suffix="%"
        />
        <p className="mt-1 text-xs text-gray-500">
          How much to transform the image (0% = keep original, 100% = full transformation)
        </p>
      </div>

      {/* Guidance Scale Slider */}
      <div>
        <Slider
          label="Prompt Adherence"
          value={guidanceScale}
          min={10}
          max={200}
          onChange={(e) => setGuidanceScale(Number(e.target.value))}
        />
        <p className="mt-1 text-xs text-gray-500">
          How closely to follow the prompt (lower = more creative, higher = more precise)
        </p>
      </div>

      {/* Info Box */}
      <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-4">
        <p className="text-sm text-blue-300">
          💡 <strong>Tip:</strong> Advanced mode gives you full control. Describe your vision in
          detail for best results.
        </p>
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
        disabled={!uploadedImage}
      >
        🚀 Generate Advanced
      </Button>
    </div>
  );
}
