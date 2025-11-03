-- Migration: Add Credits System
-- Add credits column to profiles table

-- Add credits column (default 10 for free plan)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS credits INTEGER NOT NULL DEFAULT 10;

-- Add index for credit queries
CREATE INDEX IF NOT EXISTS idx_profiles_credits ON public.profiles(credits);

-- Add plan column (enum: free, pro, business)
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

-- Add constraint for valid plans
ALTER TABLE public.profiles
ADD CONSTRAINT valid_plan CHECK (plan IN ('free', 'pro', 'business'));

-- Update existing users to have 10 credits
UPDATE public.profiles
SET credits = 10
WHERE credits IS NULL;

-- Create function to deduct credits
CREATE OR REPLACE FUNCTION deduct_credit(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  remaining_credits INTEGER;
BEGIN
  UPDATE public.profiles
  SET credits = credits - 1
  WHERE id = user_id AND credits > 0
  RETURNING credits INTO remaining_credits;
  
  RETURN COALESCE(remaining_credits, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to add credits
CREATE OR REPLACE FUNCTION add_credits(user_id UUID, amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  new_credits INTEGER;
BEGIN
  UPDATE public.profiles
  SET credits = credits + amount
  WHERE id = user_id
  RETURNING credits INTO new_credits;
  
  RETURN COALESCE(new_credits, -1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user has credits
CREATE OR REPLACE FUNCTION has_credits(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_credits INTEGER;
BEGIN
  SELECT credits INTO user_credits
  FROM public.profiles
  WHERE id = user_id;
  
  RETURN COALESCE(user_credits, 0) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create purchases table for credit transactions
CREATE TABLE IF NOT EXISTS public.purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  credits INTEGER NOT NULL,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add RLS policies for purchases
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert purchases"
  ON public.purchases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "System can update purchases"
  ON public.purchases FOR UPDATE
  USING (true);

-- Add index for purchases
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON public.purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_session ON public.purchases(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON public.purchases(status);

COMMENT ON TABLE public.purchases IS 'Credit purchase transactions';
COMMENT ON COLUMN public.profiles.credits IS 'Remaining AI generation credits';
COMMENT ON COLUMN public.profiles.plan IS 'User subscription plan (free, pro, business)';

