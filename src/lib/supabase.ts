import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  email: string;
  username: string;
  level: number;
  total_xp: number;
  created_at: string;
}

export interface Extracurricular {
  id: string;
  user_id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  level: number;
  xp: number;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  extracurricular_id: string;
  title: string;
  description: string;
  xp_reward: number;
  completed: boolean;
  completed_at: string | null;
  is_required: boolean;
  due_date: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: string;
}

export interface Competition {
  id: string;
  user_id: string;
  extracurricular_id: string;
  name: string;
  description: string;
  placement: string;
  date: string;
  xp_reward: number;
  created_at: string;
}

export interface Internship {
  id: string;
  user_id: string;
  extracurricular_id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string | null;
  skills_gained: string[];
  xp_reward: number;
  created_at: string;
}

export interface UserStats {
  id: string;
  user_id: string;
  strength: number;
  agility: number;
  intelligence: number;
  vitality: number;
  sense: number;
  charisma: number;
  luck: number;
  endurance: number;
  hygiene: number;
  perception: number;
  leadership: number;
  creativity: number;
  discipline: number;
  stat_points: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleEvent {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  start_time: string;
  duration: number;
  event_type: string;
  task_id: string | null;
  internship_id: string | null;
  created_at: string;
}