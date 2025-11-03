/**
 * Canvas Store
 * State management for Studio canvas operations
 */

import { create } from 'zustand';

export type GenerationMode = 'quick' | 'selective' | 'advanced';

export interface CanvasState {
  // Image state
  uploadedImage: File | null;
  canvasImageUrl: string | null;
  generatedImageUrl: string | null;

  // Canvas controls
  zoom: number;
  rotation: number;

  // Generation state
  mode: GenerationMode;
  isGenerating: boolean;
  generationProgress: number;

  // Actions
  setUploadedImage: (file: File | null) => void;
  setCanvasImageUrl: (url: string | null) => void;
  setGeneratedImageUrl: (url: string | null) => void;
  setZoom: (zoom: number) => void;
  setRotation: (rotation: number) => void;
  setMode: (mode: GenerationMode) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setGenerationProgress: (progress: number) => void;
  reset: () => void;
}

const initialState = {
  uploadedImage: null,
  canvasImageUrl: null,
  generatedImageUrl: null,
  zoom: 100,
  rotation: 0,
  mode: 'quick' as GenerationMode,
  isGenerating: false,
  generationProgress: 0,
};

export const useCanvasStore = create<CanvasState>((set) => ({
  ...initialState,

  setUploadedImage: (file) => set({ uploadedImage: file }),
  setCanvasImageUrl: (url) => set({ canvasImageUrl: url }),
  setGeneratedImageUrl: (url) => set({ generatedImageUrl: url }),
  setZoom: (zoom) => set({ zoom: Math.max(10, Math.min(500, zoom)) }),
  setRotation: (rotation) => set({ rotation: rotation % 360 }),
  setMode: (mode) => set({ mode }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setGenerationProgress: (progress) =>
    set({ generationProgress: Math.max(0, Math.min(100, progress)) }),
  reset: () => set(initialState),
}));
