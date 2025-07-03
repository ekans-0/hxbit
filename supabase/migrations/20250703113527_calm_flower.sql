/*
  # Fix and Enhance Social Profile System

  1. Database Fixes
    - Fix friend system functionality
    - Add profile picture support
    - Enhance user discovery
    - Improve social feed functionality
  
  2. New Features
    - Follow/unfollow system
    - Profile picture storage
    - Enhanced user search
    - Better privacy controls
*/

-- Drop existing problematic functions and recreate them
DROP FUNCTION IF EXISTS send_friend_request(text, text);
DROP FUNCTION IF EXISTS accept_friend_request(uuid);
DROP FUNCTION IF EXISTS create_achievement_post(text, jsonb, text);

-- Add profile picture column to user_profiles if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'profile_picture_url'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN profile_picture_url text;
  END IF;
END $$;

-- Add follower count columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'followers_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN followers_count integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'following_count'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN following_count integer DEFAULT 0 NOT NULL;
  END IF;
END $$;

-- Create follows table (replacing complex friend system)
CREATE TABLE IF NOT EXISTS follows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  following_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Enable RLS on follows table
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

-- Create policies for follows table
CREATE POLICY "Users can read follows"
  ON follows
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can follow others"
  ON follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
  ON follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

-- Create indexes for follows
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_following ON follows(following_id);

-- Function to follow a user
CREATE OR REPLACE FUNCTION follow_user(target_username text)
RETURNS void AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get target user ID
  SELECT id INTO target_user_id FROM users WHERE username = target_username;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot follow yourself';
  END IF;
  
  -- Check if already following
  IF EXISTS (
    SELECT 1 FROM follows 
    WHERE follower_id = auth.uid() AND following_id = target_user_id
  ) THEN
    RAISE EXCEPTION 'Already following this user';
  END IF;
  
  -- Insert follow relationship
  INSERT INTO follows (follower_id, following_id)
  VALUES (auth.uid(), target_user_id);
  
  -- Update follower counts
  UPDATE user_profiles 
  SET following_count = following_count + 1
  WHERE user_id = auth.uid();
  
  UPDATE user_profiles 
  SET followers_count = followers_count + 1
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to unfollow a user
CREATE OR REPLACE FUNCTION unfollow_user(target_username text)
RETURNS void AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get target user ID
  SELECT id INTO target_user_id FROM users WHERE username = target_username;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  -- Delete follow relationship
  DELETE FROM follows 
  WHERE follower_id = auth.uid() AND following_id = target_user_id;
  
  -- Update follower counts
  UPDATE user_profiles 
  SET following_count = GREATEST(0, following_count - 1)
  WHERE user_id = auth.uid();
  
  UPDATE user_profiles 
  SET followers_count = GREATEST(0, followers_count - 1)
  WHERE user_id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create achievement posts
CREATE OR REPLACE FUNCTION create_achievement_post(
  achievement_type text,
  achievement_data jsonb,
  privacy text DEFAULT 'public'
)
RETURNS uuid AS $$
DECLARE
  post_id uuid;
  content_text text;
BEGIN
  -- Generate content based on achievement type
  CASE achievement_type
    WHEN 'level_up' THEN
      content_text := 'Reached level ' || (achievement_data->>'level') || ' 🎉';
    WHEN 'task_milestone' THEN
      content_text := 'Completed ' || (achievement_data->>'count') || ' tasks 💪';
    WHEN 'xp_milestone' THEN
      content_text := 'Earned ' || (achievement_data->>'xp') || ' total XP ⚡';
    WHEN 'competition_win' THEN
      content_text := 'Won ' || (achievement_data->>'placement') || ' place in ' || (achievement_data->>'competition') || ' 🏆';
    ELSE
      content_text := 'Achieved something awesome 🌟';
  END CASE;
  
  -- Insert post
  INSERT INTO social_posts (user_id, content, post_type, metadata, privacy_level)
  VALUES (auth.uid(), content_text, 'achievement', achievement_data, privacy)
  RETURNING id INTO post_id;
  
  RETURN post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update global leaderboards view to include profile pictures
DROP VIEW IF EXISTS global_leaderboards;
CREATE OR REPLACE VIEW global_leaderboards AS
SELECT 
  u.id,
  u.username,
  up.display_name,
  up.profile_picture_url as avatar_url,
  u.level,
  u.total_xp,
  COALESCE(us.strength + us.agility + us.intelligence + us.vitality + us.sense + us.charisma + us.luck + us.endurance + us.hygiene + us.perception + COALESCE(us.leadership, 0) + COALESCE(us.creativity, 0) + COALESCE(us.discipline, 0), 0) as total_stats,
  (SELECT COUNT(*) FROM tasks t WHERE t.user_id = u.id AND t.completed = true) as completed_tasks,
  (SELECT COUNT(*) FROM competitions c WHERE c.user_id = u.id) as competitions_won,
  ROW_NUMBER() OVER (ORDER BY u.total_xp DESC) as xp_rank,
  ROW_NUMBER() OVER (ORDER BY u.level DESC, u.total_xp DESC) as level_rank
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_stats us ON u.id = us.user_id
WHERE up.privacy_level IN ('public', 'friends') OR up.privacy_level IS NULL
ORDER BY u.total_xp DESC;

-- Update social posts policies to be more permissive for discovery
DROP POLICY IF EXISTS "Users can read friends posts" ON social_posts;
CREATE POLICY "Users can read followed users posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (
    privacy_level = 'public' OR
    user_id = auth.uid() OR
    (privacy_level = 'friends' AND EXISTS (
      SELECT 1 FROM follows f 
      WHERE f.follower_id = auth.uid() AND f.following_id = user_id
    ))
  );

-- Update user profiles policies for better discovery
DROP POLICY IF EXISTS "Users can read friends profiles" ON user_profiles;
CREATE POLICY "Users can read followed users profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    privacy_level = 'public' OR
    user_id = auth.uid() OR
    (privacy_level = 'friends' AND EXISTS (
      SELECT 1 FROM follows f 
      WHERE f.follower_id = auth.uid() AND f.following_id = user_id
    ))
  );