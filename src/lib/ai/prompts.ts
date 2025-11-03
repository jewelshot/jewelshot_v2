/**
 * AI Prompt Builders
 * Generate prompts for different modes and presets
 */

export interface PromptOptions {
  jewelryType: string;
  gender: string;
  aspectRatio?: string;
  presetId?: string;
  // Selective mode
  model?: string;
  location?: string;
  mood?: string;
  lighting?: string;
  angle?: string;
  pose?: string;
  // Advanced mode
  customPrompt?: string;
}

/**
 * Base negative prompt for all generations
 */
const BASE_NEGATIVE_PROMPT = `
  blurry, distorted, deformed, low quality, pixelated, grainy, 
  watermark, text, logo, signature, amateur, unprofessional,
  wrong anatomy, disproportionate, unrealistic, fake-looking,
  oversaturated, overexposed, underexposed, bad lighting,
  duplicate jewelry, multiple items when single expected,
  damaged jewelry, tarnished, dirty, scratched beyond artistic intent
`.trim();

/**
 * Build Quick Mode prompt (Preset-based)
 */
export function buildQuickPrompt(options: PromptOptions): {
  prompt: string;
  negativePrompt: string;
} {
  const { jewelryType, gender, aspectRatio = '9:16', presetId } = options;

  const presets: Record<string, string> = {
    'white-background': `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Original gemstones, metals, patterns must not change
- Only background becomes pure white (RGB 255, 255, 255)

TASK:
Professional e-commerce product photo of the ${jewelryType} on clean white background.

STYLE: Clean, minimal, professional e-commerce
LIGHTING: Soft even studio lighting, no harsh shadows
COMPOSITION: Centered, ${gender === 'women' ? 'elegant feminine styling' : 'refined masculine styling'}
FOCUS: Product clarity, true colors, sharp details

OUTPUT: High-resolution product photo, Aspect ratio ${aspectRatio}
    `.trim(),

    'still-life': `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Original materials and craftsmanship preserved

TASK:
Artistic still life composition featuring the ${jewelryType} displayed on natural stone surfaces.

ENVIRONMENT: Natural stone display (marble, slate, or granite)
STYLING: Organic elements (dried flowers, crystals, natural textures)
LIGHTING: Soft natural daylight, elegant shadows
MOOD: Sophisticated, organic luxury
COMPOSITION: ${gender === 'women' ? 'Feminine elegance' : 'Masculine refinement'}

OUTPUT: Editorial still life photo, Aspect ratio ${aspectRatio}
    `.trim(),

    'on-model': `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Jewelry is THE FOCUS, not the model

TASK:
Professional lifestyle photo showing ${jewelryType} worn by ${gender === 'women' ? 'elegant woman' : 'sophisticated man'}.

MODEL: ${gender === 'women' ? 'Professional female model, 25-35 years old' : 'Professional male model, 28-40 years old'}
STYLING: Timeless, elegant, complementing jewelry without competing
COMPOSITION: Jewelry as primary focus, ${gender === 'women' ? 'graceful hand/body positioning' : 'confident masculine presence'}
LIGHTING: Professional studio lighting, flattering and clear
BACKGROUND: Soft neutral tones (cream, taupe, soft grey)

OUTPUT: Professional lifestyle photo, Aspect ratio ${aspectRatio}
    `.trim(),

    lifestyle: `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Natural setting enhances but doesn't overshadow

TASK:
Lifestyle photo of ${jewelryType} in natural, aspirational setting.

ENVIRONMENT: Natural outdoor or elegant indoor setting
MOOD: Aspirational, authentic, emotionally engaging
LIGHTING: Natural soft lighting (golden hour or diffused daylight)
STYLING: ${gender === 'women' ? 'Feminine, elegant, relatable luxury' : 'Masculine, refined, authentic sophistication'}
COMPOSITION: Jewelry integrated naturally into lifestyle moment

OUTPUT: Lifestyle editorial photo, Aspect ratio ${aspectRatio}
    `.trim(),

    luxury: `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Luxury aesthetic enhances, never alters

TASK:
Ultra-luxury editorial photo of ${jewelryType}, highest-end presentation.

STYLE: Vogue, Harper's Bazaar editorial aesthetic
LIGHTING: Dramatic, sculptural, museum-quality
ENVIRONMENT: Luxurious setting (velvet, silk, marble, gold accents)
MOOD: Exclusive, sophisticated, timeless elegance
COMPOSITION: ${gender === 'women' ? 'Haute couture feminine luxury' : 'Distinguished masculine prestige'}

OUTPUT: Luxury editorial photo, Aspect ratio ${aspectRatio}
    `.trim(),

    'close-up': `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Macro detail shows authentic craftsmanship

TASK:
Extreme close-up macro photography of ${jewelryType}, showcasing intricate details.

FOCUS: Gemstone facets, metal texture, craftsmanship details
LIGHTING: Precision lighting to reveal depth, sparkle, texture
COMPOSITION: ${gender === 'women' ? 'Delicate feminine details' : 'Bold masculine craftsmanship'}
DEPTH: Shallow depth of field, artistic bokeh
QUALITY: Ultra-sharp focus on key details

OUTPUT: Macro detail photo, Aspect ratio ${aspectRatio}
    `.trim(),
  };

  const prompt = presets[presetId || 'white-background'] || presets['white-background'];

  return {
    prompt,
    negativePrompt: BASE_NEGATIVE_PROMPT,
  };
}

/**
 * Build Selective Mode prompt
 */
export function buildSelectivePrompt(options: PromptOptions): {
  prompt: string;
  negativePrompt: string;
} {
  const { jewelryType, gender, model, location, mood, aspectRatio = '9:16' } = options;

  const prompt = `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical
- Original design is sacred, only context changes

TASK:
Professional photo of ${jewelryType} for ${gender}.

MODEL STYLE: ${model || 'professional'}
LOCATION: ${location || 'studio'}
MOOD: ${mood || 'natural'}
COMPOSITION: Balanced, jewelry as focal point
QUALITY: High-end commercial photography

OUTPUT: Professional jewelry photo, Aspect ratio ${aspectRatio}
  `.trim();

  return {
    prompt,
    negativePrompt: BASE_NEGATIVE_PROMPT,
  };
}

/**
 * Build Advanced Mode prompt
 */
export function buildAdvancedPrompt(options: PromptOptions): {
  prompt: string;
  negativePrompt: string;
} {
  const { jewelryType, gender, customPrompt, aspectRatio = '9:16' } = options;

  const baseContext = `
CRITICAL PRESERVATION RULES:
- EXACT jewelry design must remain 100% identical

TASK:
Professional photo of ${jewelryType} for ${gender}.

${customPrompt || 'High-quality professional jewelry photography'}

OUTPUT: Aspect ratio ${aspectRatio}
  `.trim();

  return {
    prompt: baseContext,
    negativePrompt: BASE_NEGATIVE_PROMPT,
  };
}
