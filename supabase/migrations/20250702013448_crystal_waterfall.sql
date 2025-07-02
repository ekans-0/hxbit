/*
  # Add missing fields and tables

  1. New Tables
    - `schedule_events` - Schedule management system
  
  2. Table Updates
    - Add `is_required` and `due_date` columns to tasks table
    - Add new character stats columns to user_stats table
  
  3. Security
    - Enable RLS on new tables
    - Add policies for authenticated users
*/

-- Add missing columns to tasks table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'is_required'
  ) THEN
    ALTER TABLE tasks ADD COLUMN is_required boolean DEFAULT false NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'tasks' AND column_name = 'due_date'
  ) THEN
    ALTER TABLE tasks ADD COLUMN due_date date;
  END IF;
END $$;

-- Add missing columns to user_stats table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'leadership'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN leadership integer DEFAULT 10 NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'creativity'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN creativity integer DEFAULT 10 NOT NULL;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_stats' AND column_name = 'discipline'
  ) THEN
    ALTER TABLE user_stats ADD COLUMN discipline integer DEFAULT 10 NOT NULL;
  END IF;
END $$;

-- Create schedule_events table
CREATE TABLE IF NOT EXISTS schedule_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text DEFAULT '' NOT NULL,
  date date NOT NULL,
  start_time time NOT NULL,
  duration integer DEFAULT 60 NOT NULL,
  event_type text DEFAULT 'personal' NOT NULL,
  task_id uuid REFERENCES tasks(id) ON DELETE SET NULL,
  internship_id uuid REFERENCES internships(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on schedule_events
ALTER TABLE schedule_events ENABLE ROW LEVEL SECURITY;

-- Create policies for schedule_events
CREATE POLICY "Users can read own schedule events"
  ON schedule_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own schedule events"
  ON schedule_events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own schedule events"
  ON schedule_events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own schedule events"
  ON schedule_events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schedule_events_user_id ON schedule_events(user_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_date ON schedule_events(date);
CREATE INDEX IF NOT EXISTS idx_schedule_events_task_id ON schedule_events(task_id);
CREATE INDEX IF NOT EXISTS idx_schedule_events_internship_id ON schedule_events(internship_id);
CREATE INDEX IF NOT EXISTS idx_tasks_is_required ON tasks(is_required);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);