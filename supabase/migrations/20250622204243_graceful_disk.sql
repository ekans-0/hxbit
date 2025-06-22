/*
  # Enhanced Solo Leveling Hub Schema

  1. New Tables
    - `user_stats` - RPG-style user attributes (strength, agility, etc.)
    - `competitions` - Track competitive achievements
    - `internships` - Professional experience tracking
  
  2. Security
    - Enable RLS on all new tables
    - Add policies for authenticated users to manage their own data
  
  3. Indexes
    - Add performance indexes for common queries
*/

-- User Stats Table (RPG-style attributes)
CREATE TABLE IF NOT EXISTS user_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  strength integer DEFAULT 10 NOT NULL,
  agility integer DEFAULT 10 NOT NULL,
  intelligence integer DEFAULT 10 NOT NULL,
  vitality integer DEFAULT 10 NOT NULL,
  sense integer DEFAULT 10 NOT NULL,
  charisma integer DEFAULT 10 NOT NULL,
  luck integer DEFAULT 10 NOT NULL,
  endurance integer DEFAULT 10 NOT NULL,
  hygiene integer DEFAULT 10 NOT NULL,
  perception integer DEFAULT 10 NOT NULL,
  stat_points integer DEFAULT 5 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Competitions Table
CREATE TABLE IF NOT EXISTS competitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  extracurricular_id uuid REFERENCES extracurriculars(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text DEFAULT '' NOT NULL,
  placement text NOT NULL,
  date date NOT NULL,
  xp_reward integer DEFAULT 50 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Internships Table
CREATE TABLE IF NOT EXISTS internships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  extracurricular_id uuid REFERENCES extracurriculars(id) ON DELETE CASCADE NOT NULL,
  company text NOT NULL,
  position text NOT NULL,
  description text DEFAULT '' NOT NULL,
  start_date date NOT NULL,
  end_date date,
  skills_gained text[] DEFAULT '{}' NOT NULL,
  xp_reward integer DEFAULT 150 NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;

-- User Stats Policies
CREATE POLICY "Users can read own stats"
  ON user_stats
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON user_stats
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON user_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Competitions Policies
CREATE POLICY "Users can read own competitions"
  ON competitions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own competitions"
  ON competitions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own competitions"
  ON competitions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own competitions"
  ON competitions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Internships Policies
CREATE POLICY "Users can read own internships"
  ON internships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own internships"
  ON internships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own internships"
  ON internships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own internships"
  ON internships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_competitions_user_id ON competitions(user_id);
CREATE INDEX IF NOT EXISTS idx_competitions_extracurricular_id ON competitions(extracurricular_id);
CREATE INDEX IF NOT EXISTS idx_competitions_date ON competitions(date);
CREATE INDEX IF NOT EXISTS idx_internships_user_id ON internships(user_id);
CREATE INDEX IF NOT EXISTS idx_internships_extracurricular_id ON internships(extracurricular_id);
CREATE INDEX IF NOT EXISTS idx_internships_start_date ON internships(start_date);