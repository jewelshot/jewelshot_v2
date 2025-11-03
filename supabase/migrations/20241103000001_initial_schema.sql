-- =====================================================
-- Jewelshot V2 - Initial Database Schema
-- =====================================================
-- This migration creates the core tables and policies
-- for the Jewelshot application
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Extends auth.users with additional user metadata
-- One-to-one relationship with auth.users

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  
  -- Usage limits and tracking
  images_count INTEGER DEFAULT 0,
  ai_generations_count INTEGER DEFAULT 0,
  storage_used_bytes BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_subscription_tier ON public.profiles(subscription_tier);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- IMAGES TABLE
-- =====================================================
-- Stores uploaded and generated images

CREATE TABLE public.images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- File information
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  
  -- Image metadata
  width INTEGER,
  height INTEGER,
  aspect_ratio TEXT,
  
  -- Source information
  source_type TEXT DEFAULT 'upload' CHECK (source_type IN ('upload', 'ai_generated', 'edited')),
  parent_image_id UUID REFERENCES public.images(id) ON DELETE SET NULL,
  
  -- Organization
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes
CREATE INDEX idx_images_user_id ON public.images(user_id);
CREATE INDEX idx_images_source_type ON public.images(source_type);
CREATE INDEX idx_images_is_favorite ON public.images(is_favorite);
CREATE INDEX idx_images_created_at ON public.images(created_at DESC);
CREATE INDEX idx_images_tags ON public.images USING GIN(tags);

-- Enable RLS
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- RLS Policies for images
CREATE POLICY "Users can view own images"
  ON public.images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own images"
  ON public.images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own images"
  ON public.images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own images"
  ON public.images FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- PROJECTS TABLE
-- =====================================================
-- Stores canvas projects (state for save/load)

CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Project information
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  
  -- Canvas state (stored as JSON)
  canvas_state JSONB NOT NULL DEFAULT '{}',
  
  -- Metadata
  is_template BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  last_opened_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_projects_is_template ON public.projects(is_template);
CREATE INDEX idx_projects_is_public ON public.projects(is_public);
CREATE INDEX idx_projects_updated_at ON public.projects(updated_at DESC);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- AI_GENERATIONS TABLE
-- =====================================================
-- Stores AI generation history and parameters

CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_id UUID REFERENCES public.images(id) ON DELETE SET NULL,
  
  -- Generation parameters
  prompt TEXT NOT NULL,
  negative_prompt TEXT,
  jewelry_type TEXT CHECK (jewelry_type IN ('ring', 'necklace', 'earring', 'bracelet')),
  gender TEXT CHECK (gender IN ('women', 'men')),
  aspect_ratio TEXT NOT NULL,
  
  -- Mode and parameters (stored as JSONB for flexibility)
  mode TEXT CHECK (mode IN ('quick', 'selective', 'advanced')) NOT NULL,
  parameters JSONB DEFAULT '{}',
  
  -- Result information
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')) NOT NULL,
  result_url TEXT,
  error_message TEXT,
  
  -- Cost tracking (for future billing)
  cost_credits DECIMAL(10,2) DEFAULT 1.0,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_ai_generations_user_id ON public.ai_generations(user_id);
CREATE INDEX idx_ai_generations_status ON public.ai_generations(status);
CREATE INDEX idx_ai_generations_mode ON public.ai_generations(mode);
CREATE INDEX idx_ai_generations_created_at ON public.ai_generations(created_at DESC);

-- Enable RLS
ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own generations"
  ON public.ai_generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations"
  ON public.ai_generations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations"
  ON public.ai_generations FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER images_updated_at
  BEFORE UPDATE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Function to update profile storage usage
CREATE OR REPLACE FUNCTION public.update_storage_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.profiles
    SET 
      images_count = images_count + 1,
      storage_used_bytes = storage_used_bytes + NEW.file_size
    WHERE id = NEW.user_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.profiles
    SET 
      images_count = images_count - 1,
      storage_used_bytes = storage_used_bytes - OLD.file_size
    WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update storage usage
CREATE TRIGGER update_user_storage
  AFTER INSERT OR DELETE ON public.images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_storage_usage();

-- Function to update AI generation count
CREATE OR REPLACE FUNCTION public.update_ai_generation_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE public.profiles
    SET ai_generations_count = ai_generations_count + 1
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to update AI generation count
CREATE TRIGGER update_user_ai_count
  AFTER INSERT OR UPDATE ON public.ai_generations
  FOR EACH ROW
  EXECUTE FUNCTION public.update_ai_generation_count();

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
-- Create storage buckets for images

INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('images', 'images', true),
  ('avatars', 'avatars', true),
  ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for images bucket
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for avatars bucket
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Create indexes on foreign keys for join performance
CREATE INDEX IF NOT EXISTS idx_images_parent_image_id ON public.images(parent_image_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_image_id ON public.ai_generations(image_id);

-- Composite indexes for common queries
CREATE INDEX idx_images_user_created ON public.images(user_id, created_at DESC);
CREATE INDEX idx_projects_user_updated ON public.projects(user_id, updated_at DESC);

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON TABLE public.profiles IS 'User profiles extending auth.users';
COMMENT ON TABLE public.images IS 'Uploaded and generated images';
COMMENT ON TABLE public.projects IS 'Saved canvas projects';
COMMENT ON TABLE public.ai_generations IS 'AI generation history and parameters';

COMMENT ON COLUMN public.profiles.subscription_tier IS 'User subscription level: free, pro, or enterprise';
COMMENT ON COLUMN public.images.source_type IS 'How the image was created: upload, ai_generated, or edited';
COMMENT ON COLUMN public.projects.canvas_state IS 'Serialized canvas state (filters, transforms, etc.)';
COMMENT ON COLUMN public.ai_generations.parameters IS 'Mode-specific parameters as JSON';

