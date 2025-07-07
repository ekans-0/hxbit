/*
  # Security and Performance Improvements

  1. Security Enhancements
    - Add rate limiting policies
    - Improve RLS policies with better security checks
    - Add input validation functions
    - Add audit logging

  2. Performance Improvements
    - Add missing indexes
    - Optimize existing queries
    - Add database functions for common operations

  3. Data Integrity
    - Add constraints and checks
    - Improve foreign key relationships
    - Add triggers for data consistency
*/

-- Create rate limiting table
CREATE TABLE IF NOT EXISTS rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  count integer DEFAULT 1,
  window_start timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create audit log table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  table_name text NOT NULL,
  record_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_rate_limits_user_action ON rate_limits(user_id, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window ON rate_limits(window_start);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_social_posts_user_created ON social_posts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_user ON post_likes(post_id, user_id);

-- Add unique constraint for usernames (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS users_username_lower_idx ON users(LOWER(username));

-- Function to check rate limits
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_user_id uuid,
  p_action_type text,
  p_max_requests integer DEFAULT 100,
  p_window_minutes integer DEFAULT 60
) RETURNS boolean AS $$
DECLARE
  current_count integer;
  window_start timestamptz;
BEGIN
  window_start := now() - (p_window_minutes || ' minutes')::interval;
  
  -- Clean old entries
  DELETE FROM rate_limits 
  WHERE window_start < window_start;
  
  -- Get current count
  SELECT COALESCE(SUM(count), 0) INTO current_count
  FROM rate_limits
  WHERE user_id = p_user_id 
    AND action_type = p_action_type 
    AND window_start >= window_start;
  
  -- Check if limit exceeded
  IF current_count >= p_max_requests THEN
    RETURN false;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO rate_limits (user_id, action_type, count, window_start)
  VALUES (p_user_id, p_action_type, 1, now())
  ON CONFLICT (user_id, action_type) 
  DO UPDATE SET 
    count = rate_limits.count + 1,
    window_start = CASE 
      WHEN rate_limits.window_start < window_start THEN now()
      ELSE rate_limits.window_start
    END;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to sanitize text input
CREATE OR REPLACE FUNCTION sanitize_text(input_text text) RETURNS text AS $$
BEGIN
  IF input_text IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Remove potential XSS characters and limit length
  RETURN LEFT(
    REGEXP_REPLACE(
      TRIM(input_text), 
      '[<>]', 
      '', 
      'g'
    ), 
    1000
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to validate username
CREATE OR REPLACE FUNCTION is_valid_username(username text) RETURNS boolean AS $$
BEGIN
  RETURN username ~ '^[a-zA-Z0-9_]{3,20}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
  p_user_id uuid,
  p_action text,
  p_table_name text,
  p_record_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL
) RETURNS void AS $$
BEGIN
  INSERT INTO audit_logs (
    user_id, 
    action, 
    table_name, 
    record_id, 
    old_values, 
    new_values
  ) VALUES (
    p_user_id, 
    p_action, 
    p_table_name, 
    p_record_id, 
    p_old_values, 
    p_new_values
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Improved RLS policies with rate limiting
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;

-- Drop existing policies and recreate with security improvements
DROP POLICY IF EXISTS "Users can insert own posts" ON social_posts;
CREATE POLICY "Users can insert own posts" ON social_posts
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id 
    AND check_rate_limit(auth.uid(), 'create_post', 10, 60)
    AND LENGTH(sanitize_text(content)) > 0
    AND LENGTH(sanitize_text(content)) <= 1000
  );

-- Update posts policy with content validation
DROP POLICY IF EXISTS "Users can update own posts" ON social_posts;
CREATE POLICY "Users can update own posts" ON social_posts
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id 
    AND LENGTH(sanitize_text(content)) > 0
    AND LENGTH(sanitize_text(content)) <= 1000
  );

-- Improve follow rate limiting
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can follow others" ON follows;
CREATE POLICY "Users can follow others" ON follows
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = follower_id 
    AND follower_id != following_id
    AND check_rate_limit(auth.uid(), 'follow_user', 50, 60)
  );

-- Add constraints for data integrity
ALTER TABLE users ADD CONSTRAINT users_username_valid 
  CHECK (is_valid_username(username));

ALTER TABLE users ADD CONSTRAINT users_level_positive 
  CHECK (level > 0);

ALTER TABLE users ADD CONSTRAINT users_total_xp_non_negative 
  CHECK (total_xp >= 0);

ALTER TABLE tasks ADD CONSTRAINT tasks_xp_reward_positive 
  CHECK (xp_reward > 0);

ALTER TABLE user_stats ADD CONSTRAINT user_stats_values_positive 
  CHECK (
    strength >= 0 AND agility >= 0 AND intelligence >= 0 AND 
    vitality >= 0 AND sense >= 0 AND charisma >= 0 AND 
    luck >= 0 AND endurance >= 0 AND hygiene >= 0 AND 
    perception >= 0 AND leadership >= 0 AND creativity >= 0 AND 
    discipline >= 0 AND stat_points >= 0
  );

-- Create trigger for audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event(
      COALESCE(NEW.user_id, auth.uid()),
      'INSERT',
      TG_TABLE_NAME,
      NEW.id,
      NULL,
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event(
      COALESCE(NEW.user_id, auth.uid()),
      'UPDATE',
      TG_TABLE_NAME,
      NEW.id,
      to_jsonb(OLD),
      to_jsonb(NEW)
    );
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event(
      COALESCE(OLD.user_id, auth.uid()),
      'DELETE',
      TG_TABLE_NAME,
      OLD.id,
      to_jsonb(OLD),
      NULL
    );
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit triggers to important tables
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
CREATE TRIGGER audit_users_trigger
  AFTER INSERT OR UPDATE OR DELETE ON users
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_social_posts_trigger ON social_posts;
CREATE TRIGGER audit_social_posts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON social_posts
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Enable RLS on all tables
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for rate_limits (admin only)
CREATE POLICY "Only service role can access rate_limits" ON rate_limits
  FOR ALL TO service_role
  USING (true);

-- RLS policies for audit_logs (admin only)
CREATE POLICY "Only service role can access audit_logs" ON audit_logs
  FOR ALL TO service_role
  USING (true);

-- Function to clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data() RETURNS void AS $$
BEGIN
  -- Clean rate limits older than 24 hours
  DELETE FROM rate_limits 
  WHERE window_start < now() - interval '24 hours';
  
  -- Clean audit logs older than 90 days
  DELETE FROM audit_logs 
  WHERE created_at < now() - interval '90 days';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to clean up old data (if pg_cron is available)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');