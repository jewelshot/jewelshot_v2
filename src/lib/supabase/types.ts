/**
 * Supabase Database Types
 * Simplified for MVP
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Profile type
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  credits: number;
  plan: 'free' | 'pro' | 'premium';
  storage_used: number;
  ai_generation_count: number;
  created_at: string;
  updated_at: string;
}

// Image type
export interface Image {
  id: string;
  user_id: string;
  original_url: string;
  edited_url: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  metadata: Json;
  created_at: string;
  updated_at: string;
}

// Project type
export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

// AI Generation type
export interface AIGeneration {
  id: string;
  user_id: string;
  image_id: string | null;
  model_name: string;
  prompt: string;
  negative_prompt: string | null;
  parameters: Json;
  status: string;
  result_url: string | null;
  error_message: string | null;
  inference_time: number | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

// Insert types
export type ImageInsert = Omit<Image, 'id' | 'created_at' | 'updated_at'>;
export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>;
export type AIGenerationInsert = Omit<AIGeneration, 'id' | 'created_at' | 'updated_at'>;

// Update types
export type ProfileUpdate = Partial<Profile>;
export type ImageUpdate = Partial<Image>;
export type ProjectUpdate = Partial<Project>;

// Database interface
export interface Database {
  public: {
    Tables: {
      [key: string]: {
        Row: any;
        Insert: any;
        Update: any;
        Relationships: any[];
      };
    };
    Views: {
      [key: string]: {
        Row: any;
        Relationships: any[];
      };
    };
    Functions: {
      [key: string]: {
        Args: any;
        Returns: any;
      };
    };
    Enums: {
      [key: string]: string;
    };
  };
}
