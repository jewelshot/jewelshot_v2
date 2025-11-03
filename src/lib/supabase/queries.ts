/**
 * Supabase Database Query Helpers
 * Type-safe database queries
 */

import type {
  Profile,
  Image,
  Project,
  AIGeneration,
  ProfileUpdate,
  ImageInsert,
  ProjectInsert,
  AIGenerationInsert,
} from './types';
import { createClient } from './client';

// =====================================================
// PROFILE QUERIES
// =====================================================

export async function getProfile(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();

  if (error) throw error;
  return data as any as Profile;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as any as Profile;
}

// =====================================================
// IMAGE QUERIES
// =====================================================

export async function getUserImages(userId: string, limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as any as Image[];
}

export async function getImage(imageId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('images').select('*').eq('id', imageId).single();

  if (error) throw error;
  return data as any as Image;
}

export async function createImage(image: ImageInsert) {
  const supabase = createClient();
  const { data, error } = await supabase.from('images').insert(image).select().single();

  if (error) throw error;
  return data as any as Image;
}

export async function deleteImage(imageId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('images').delete().eq('id', imageId);

  if (error) throw error;
}

export async function toggleFavorite(imageId: string, isFavorite: boolean) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('images')
    .update({ is_favorite: isFavorite })
    .eq('id', imageId)
    .select()
    .single();

  if (error) throw error;
  return data as any as Image;
}

// =====================================================
// PROJECT QUERIES
// =====================================================

export async function getUserProjects(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data as any as Project[];
}

export async function getProject(projectId: string) {
  const supabase = createClient();
  const { data, error } = await supabase.from('projects').select('*').eq('id', projectId).single();

  if (error) throw error;
  return data as any as Project;
}

export async function createProject(project: ProjectInsert) {
  const supabase = createClient();
  const { data, error } = await supabase.from('projects').insert(project).select().single();

  if (error) throw error;
  return data as any as Project;
}

export async function updateProject(projectId: string, updates: Partial<Project>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId)
    .select()
    .single();

  if (error) throw error;
  return data as any as Project;
}

export async function deleteProject(projectId: string) {
  const supabase = createClient();
  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  if (error) throw error;
}

// =====================================================
// AI GENERATION QUERIES
// =====================================================

export async function getUserGenerations(userId: string, limit = 50) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as any as AIGeneration[];
}

export async function getGeneration(generationId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('id', generationId)
    .single();

  if (error) throw error;
  return data as any as AIGeneration;
}

export async function createGeneration(generation: AIGenerationInsert) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('ai_generations')
    .insert(generation)
    .select()
    .single();

  if (error) throw error;
  return data as any as AIGeneration;
}

export async function updateGenerationStatus(
  generationId: string,
  status: AIGeneration['status'],
  resultUrl?: string,
  errorMessage?: string
) {
  const supabase = createClient();
  const updates: Partial<AIGeneration> = {
    status,
    result_url: resultUrl,
    error_message: errorMessage,
  };

  if (status === 'completed' || status === 'failed') {
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('ai_generations')
    .update(updates)
    .eq('id', generationId)
    .select()
    .single();

  if (error) throw error;
  return data as any as AIGeneration;
}

// =====================================================
// STORAGE HELPERS
// =====================================================

export async function uploadImage(
  userId: string,
  file: File,
  bucket: 'images' | 'avatars' | 'thumbnails' = 'images'
) {
  const supabase = createClient();

  // Generate unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage.from(bucket).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) throw error;

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(fileName);

  return {
    path: fileName,
    url: publicUrl,
  };
}

export async function deleteStorageFile(
  path: string,
  bucket: 'images' | 'avatars' | 'thumbnails' = 'images'
) {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) throw error;
}
