/**
 * Global Type Definitions
 * Shared types across the application
 */

// Common utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type Maybe<T> = T | null | undefined;

// Component props helper types
export type WithChildren<T = object> = T & { children: React.ReactNode };
export type WithClassName<T = object> = T & { className?: string };

// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Image types
export interface ImageFile {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  width?: number;
  height?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  size: number;
  aspectRatio: string;
}

// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Filter/Edit types
export interface FilterValues {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpness: number;
  clarity: number;
  dehaze: number;
}

export type FilterType = keyof FilterValues;

// Canvas types
export interface CanvasState {
  width: number;
  height: number;
  zoom: number;
  x: number;
  y: number;
}

export interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
}

// AI Generation types
export type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet';
export type Gender = 'women' | 'men';
export type AspectRatio = '1:1' | '4:5' | '3:4' | '2:3' | '9:16' | '16:9' | '21:9' | '4:3';

export interface AIGenerationParams {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatio;
  jewelryType: JewelryType;
  gender?: Gender;
}

export interface AIGenerationResult {
  id: string;
  imageUrl: string;
  params: AIGenerationParams;
  createdAt: Date;
  status: 'pending' | 'completed' | 'failed';
  error?: string;
}
