/*
  # Social Profile System

  1. New Tables
    - `user_profiles` - Extended user profile information
    - `friendships` - Friend relationships between users
    - `friend_requests` - Pending friend requests
    - `shared_achievements` - Achievements shared with friends
    - `leaderboards` - Global and friend leaderboards
    - `social_posts` - User posts and updates
    - `post_likes` - Likes on social posts
    - `user_badges` - Special badges and titles

  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate data access
    - Friend-based privacy controls

  3. Features
    - Friend system with requests
    - Stat sharing and comparisons
    - Achievement sharing
    - Social feed
    - Leaderboards
    - Profile customization
*/

-- User Profiles Table (Extended profile info)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name text,
  bio text DEFAULT '' NOT NULL,
  avatar_url text,
  banner_url text,
  location text,
  website text,
  privacy_level text DEFAULT 'friends' NOT NULL CHECK (privacy_level IN ('public', 'friends', 'private')),
  show_stats boolean DEFAULT true NOT NULL,
  show_achievements boolean DEFAULT true NOT NULL,
  show_activities boolean DEFAULT true NOT NULL,
  is_online boolean DEFAULT false NOT NULL,
  last_seen timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Friendships Table
CREATE TABLE IF NOT EXISTS friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  friend_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'blocked')),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, friend_id),
  CHECK (user_id != friend_id)
);

-- Friend Requests Table
CREATE TABLE IF NOT EXISTS friend_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'accepted', 'declined')),
  message text DEFAULT '' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(sender_id, receiver_id),
  CHECK (sender_id != receiver_id)
);

-- User Badges Table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  badge_type text NOT NULL,
  badge_name text NOT NULL,
  badge_description text NOT NULL,
  badge_icon text DEFAULT '🏆' NOT NULL,
  badge_color text DEFAULT '#F59E0B' NOT NULL,
  is_equipped boolean DEFAULT false NOT NULL,
  earned_at timestamptz DEFAULT now() NOT NULL
);

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  post_type text DEFAULT 'status' NOT NULL CHECK (post_type IN ('status', 'achievement', 'level_up', 'milestone')),
  metadata jsonb DEFAULT '{}' NOT NULL,
  privacy_level text DEFAULT 'friends' NOT NULL CHECK (privacy_level IN ('public', 'friends', 'private')),
  likes_count integer DEFAULT 0 NOT NULL,
  comments_count integer DEFAULT 0 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Post Likes Table
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES social_posts(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(post_id, user_id)
);

-- Shared Achievements Table
CREATE TABLE IF NOT EXISTS shared_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  achievement_type text NOT NULL,
  achievement_data jsonb NOT NULL,
  shared_with text DEFAULT 'friends' NOT NULL CHECK (shared_with IN ('public', 'friends')),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Global Leaderboards View
CREATE OR REPLACE VIEW global_leaderboards AS
SELECT 
  u.id,
  u.username,
  up.display_name,
  up.avatar_url,
  u.level,
  u.total_xp,
  COALESCE(us.strength + us.agility + us.intelligence + us.vitality + us.sense + us.charisma + us.luck + us.endurance + us.hygiene + us.perception + us.leadership + us.creativity + us.discipline, 0) as total_stats,
  (SELECT COUNT(*) FROM tasks t WHERE t.user_id = u.id AND t.completed = true) as completed_tasks,
  (SELECT COUNT(*) FROM competitions c WHERE c.user_id = u.id) as competitions_won,
  ROW_NUMBER() OVER (ORDER BY u.total_xp DESC) as xp_rank,
  ROW_NUMBER() OVER (ORDER BY u.level DESC, u.total_xp DESC) as level_rank
FROM users u
LEFT JOIN user_profiles up ON u.id = up.user_id
LEFT JOIN user_stats us ON u.id = us.user_id
WHERE up.privacy_level IN ('public', 'friends')
ORDER BY u.total_xp DESC;

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE friend_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_achievements ENABLE ROW LEVEL SECURITY;

-- User Profiles Policies
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (privacy_level = 'public');

CREATE POLICY "Users can read friends profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    privacy_level = 'friends' AND (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM friendships f 
        WHERE (f.user_id = auth.uid() AND f.friend_id = user_id)
           OR (f.user_id = user_id AND f.friend_id = auth.uid())
      )
    )
  );

CREATE POLICY "Users can insert own profile"
  ON user_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Friendships Policies
CREATE POLICY "Users can read own friendships"
  ON friendships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() = friend_id);

CREATE POLICY "Users can insert own friendships"
  ON friendships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own friendships"
  ON friendships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own friendships"
  ON friendships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Friend Requests Policies
CREATE POLICY "Users can read own friend requests"
  ON friend_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can insert friend requests"
  ON friend_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received requests"
  ON friend_requests
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id);

CREATE POLICY "Users can delete own requests"
  ON friend_requests
  FOR DELETE
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- User Badges Policies
CREATE POLICY "Users can read own badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read friends badges"
  ON user_badges
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM friendships f 
      WHERE (f.user_id = auth.uid() AND f.friend_id = user_id)
         OR (f.user_id = user_id AND f.friend_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own badges"
  ON user_badges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own badges"
  ON user_badges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Social Posts Policies
CREATE POLICY "Users can read own posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (privacy_level = 'public');

CREATE POLICY "Users can read friends posts"
  ON social_posts
  FOR SELECT
  TO authenticated
  USING (
    privacy_level = 'friends' AND
    EXISTS (
      SELECT 1 FROM friendships f 
      WHERE (f.user_id = auth.uid() AND f.friend_id = user_id)
         OR (f.user_id = user_id AND f.friend_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own posts"
  ON social_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON social_posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON social_posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Post Likes Policies
CREATE POLICY "Users can read post likes"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert own likes"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Shared Achievements Policies
CREATE POLICY "Users can read own shared achievements"
  ON shared_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read public shared achievements"
  ON shared_achievements
  FOR SELECT
  TO authenticated
  USING (shared_with = 'public');

CREATE POLICY "Users can read friends shared achievements"
  ON shared_achievements
  FOR SELECT
  TO authenticated
  USING (
    shared_with = 'friends' AND
    EXISTS (
      SELECT 1 FROM friendships f 
      WHERE (f.user_id = auth.uid() AND f.friend_id = user_id)
         OR (f.user_id = user_id AND f.friend_id = auth.uid())
    )
  );

CREATE POLICY "Users can insert own shared achievements"
  ON shared_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_privacy ON user_profiles(privacy_level);
CREATE INDEX IF NOT EXISTS idx_friendships_user_id ON friendships(user_id);
CREATE INDEX IF NOT EXISTS idx_friendships_friend_id ON friendships(friend_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_sender ON friend_requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_receiver ON friend_requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_friend_requests_status ON friend_requests(status);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_type ON user_badges(badge_type);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_privacy ON social_posts(privacy_level);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_achievements_user_id ON shared_achievements(user_id);

-- Functions for friend management
CREATE OR REPLACE FUNCTION send_friend_request(receiver_username text, message text DEFAULT '')
RETURNS uuid AS $$
DECLARE
  receiver_user_id uuid;
  request_id uuid;
BEGIN
  -- Get receiver user ID
  SELECT id INTO receiver_user_id FROM users WHERE username = receiver_username;
  
  IF receiver_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found';
  END IF;
  
  IF receiver_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Cannot send friend request to yourself';
  END IF;
  
  -- Check if already friends
  IF EXISTS (
    SELECT 1 FROM friendships 
    WHERE (user_id = auth.uid() AND friend_id = receiver_user_id)
       OR (user_id = receiver_user_id AND friend_id = auth.uid())
  ) THEN
    RAISE EXCEPTION 'Already friends with this user';
  END IF;
  
  -- Check if request already exists
  IF EXISTS (
    SELECT 1 FROM friend_requests 
    WHERE sender_id = auth.uid() AND receiver_id = receiver_user_id AND status = 'pending'
  ) THEN
    RAISE EXCEPTION 'Friend request already sent';
  END IF;
  
  -- Insert friend request
  INSERT INTO friend_requests (sender_id, receiver_id, message)
  VALUES (auth.uid(), receiver_user_id, message)
  RETURNING id INTO request_id;
  
  RETURN request_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION accept_friend_request(request_id uuid)
RETURNS void AS $$
DECLARE
  sender_user_id uuid;
  receiver_user_id uuid;
BEGIN
  -- Get request details
  SELECT sender_id, receiver_id INTO sender_user_id, receiver_user_id
  FROM friend_requests 
  WHERE id = request_id AND receiver_id = auth.uid() AND status = 'pending';
  
  IF sender_user_id IS NULL THEN
    RAISE EXCEPTION 'Friend request not found or not authorized';
  END IF;
  
  -- Update request status
  UPDATE friend_requests 
  SET status = 'accepted', updated_at = now()
  WHERE id = request_id;
  
  -- Create friendship (both directions)
  INSERT INTO friendships (user_id, friend_id) VALUES (sender_user_id, receiver_user_id);
  INSERT INTO friendships (user_id, friend_id) VALUES (receiver_user_id, sender_user_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create automatic posts for achievements
CREATE OR REPLACE FUNCTION create_achievement_post(
  achievement_type text,
  achievement_data jsonb,
  privacy text DEFAULT 'friends'
)
RETURNS uuid AS $$
DECLARE
  post_id uuid;
  content_text text;
BEGIN
  -- Generate content based on achievement type
  CASE achievement_type
    WHEN 'level_up' THEN
      content_text := 'Just reached level ' || (achievement_data->>'level') || '! 🎉';
    WHEN 'task_milestone' THEN
      content_text := 'Completed ' || (achievement_data->>'count') || ' tasks! 💪';
    WHEN 'xp_milestone' THEN
      content_text := 'Earned ' || (achievement_data->>'xp') || ' total XP! ⚡';
    WHEN 'competition_win' THEN
      content_text := 'Won ' || (achievement_data->>'placement') || ' place in ' || (achievement_data->>'competition') || '! 🏆';
    ELSE
      content_text := 'Achieved something awesome! 🌟';
  END CASE;
  
  -- Insert post
  INSERT INTO social_posts (user_id, content, post_type, metadata, privacy_level)
  VALUES (auth.uid(), content_text, 'achievement', achievement_data, privacy)
  RETURNING id INTO post_id;
  
  RETURN post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;