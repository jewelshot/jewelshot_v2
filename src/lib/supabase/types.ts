/**
 * Supabase Database Types
 * Auto-generated types based on database schema
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Enums
export type SubscriptionTier = 'free' | 'pro' | 'enterprise';
export type SourceType = 'upload' | 'ai_generated' | 'edited';
export type GenerationMode = 'quick' | 'selective' | 'advanced';
export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed';
export type JewelryType = 'ring' | 'necklace' | 'earring' | 'bracelet';
export type Gender = 'women' | 'men';

// Table row types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  credits: number; // AI generation credits
  plan: 'free' | 'pro' | 'business'; // Subscription plan
  images_count: number;
  ai_generations_count: number;
  storage_used_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface Image {
  id: string;
  user_id: string;
  storage_path: string;
  url: string;
  filename: string;
  file_size: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  aspect_ratio: string | null;
  source_type: SourceType;
  parent_image_id: string | null;
  is_favorite: boolean;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  canvas_state: Json;
  is_template: boolean;
  is_public: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  last_opened_at: string | null;
}

export interface AIGeneration {
  id: string;
  user_id: string;
  image_id: string | null;
  prompt: string;
  negative_prompt: string | null;
  jewelry_type: JewelryType | null;
  gender: Gender | null;
  aspect_ratio: string;
  mode: GenerationMode;
  parameters: Json;
  status: GenerationStatus;
  result_url: string | null;
  error_message: string | null;
  cost_credits: number;
  created_at: string;
  completed_at: string | null;
}

// Insert types (for creating new records)
export type ProfileInsert = Omit<
  Profile,
  'created_at' | 'updated_at' | 'images_count' | 'ai_generations_count' | 'storage_used_bytes'
> & {
  created_at?: string;
  updated_at?: string;
};

export type ImageInsert = Omit<Image, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at' | 'view_count'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type AIGenerationInsert = Omit<AIGeneration, 'id' | 'created_at' | 'completed_at'> & {
  id?: string;
  created_at?: string;
};

// Update types (for updating records)
export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at'>>;
export type ImageUpdate = Partial<Omit<Image, 'id' | 'user_id' | 'created_at'>>;
export type ProjectUpdate = Partial<Omit<Project, 'id' | 'user_id' | 'created_at'>>;
export type AIGenerationUpdate = Partial<Omit<AIGeneration, 'id' | 'user_id' | 'created_at'>>;

// Database interface
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      images: {
        Row: Image;
        Insert: ImageInsert;
        Update: ImageUpdate;
      };
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: ProjectUpdate;
      };
      ai_generations: {
        Row: AIGeneration;
        Insert: AIGenerationInsert;
        Update: AIGenerationUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      subscription_tier: SubscriptionTier;
      source_type: SourceType;
      generation_mode: GenerationMode;
      generation_status: GenerationStatus;
      jewelry_type: JewelryType;
      gender: Gender;
    };
  };
}
