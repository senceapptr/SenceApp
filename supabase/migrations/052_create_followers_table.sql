-- Create followers table for user follow system
-- Migration: 052_create_followers_table.sql

-- Create followers table
CREATE TABLE IF NOT EXISTS public.followers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Prevent self-following and duplicate follows
    CONSTRAINT no_self_follow CHECK (follower_id != following_id),
    CONSTRAINT unique_follow UNIQUE (follower_id, following_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_followers_follower_id ON public.followers(follower_id);
CREATE INDEX IF NOT EXISTS idx_followers_following_id ON public.followers(following_id);

-- Enable RLS
ALTER TABLE public.followers ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view followers (public data)
CREATE POLICY "followers_select_policy" ON public.followers
    FOR SELECT USING (true);

-- Users can only insert their own follows
CREATE POLICY "followers_insert_policy" ON public.followers
    FOR INSERT WITH CHECK (auth.uid() = follower_id);

-- Users can only delete their own follows
CREATE POLICY "followers_delete_policy" ON public.followers
    FOR DELETE USING (auth.uid() = follower_id);

-- Function to check if a user is following another user
CREATE OR REPLACE FUNCTION public.is_following(p_follower_id UUID, p_following_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.followers 
        WHERE follower_id = p_follower_id AND following_id = p_following_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get follower count
CREATE OR REPLACE FUNCTION public.get_follower_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.followers WHERE following_id = p_user_id)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get following count
CREATE OR REPLACE FUNCTION public.get_following_count(p_user_id UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM public.followers WHERE follower_id = p_user_id)::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add follower_count and following_count to profiles table (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'follower_count') THEN
        ALTER TABLE public.profiles ADD COLUMN follower_count INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'following_count') THEN
        ALTER TABLE public.profiles ADD COLUMN following_count INTEGER DEFAULT 0;
    END IF;
END $$;

-- Trigger function to update follower counts
CREATE OR REPLACE FUNCTION public.update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following_count for the follower
        UPDATE public.profiles 
        SET following_count = COALESCE(following_count, 0) + 1 
        WHERE id = NEW.follower_id;
        
        -- Increment follower_count for the user being followed
        UPDATE public.profiles 
        SET follower_count = COALESCE(follower_count, 0) + 1 
        WHERE id = NEW.following_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following_count for the follower
        UPDATE public.profiles 
        SET following_count = GREATEST(COALESCE(following_count, 0) - 1, 0) 
        WHERE id = OLD.follower_id;
        
        -- Decrement follower_count for the user being unfollowed
        UPDATE public.profiles 
        SET follower_count = GREATEST(COALESCE(follower_count, 0) - 1, 0) 
        WHERE id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for follower count updates
DROP TRIGGER IF EXISTS on_follow_change ON public.followers;
CREATE TRIGGER on_follow_change
    AFTER INSERT OR DELETE ON public.followers
    FOR EACH ROW
    EXECUTE FUNCTION public.update_follower_counts();

-- Grant necessary permissions
GRANT SELECT, INSERT, DELETE ON public.followers TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_following TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_follower_count TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_following_count TO authenticated;
