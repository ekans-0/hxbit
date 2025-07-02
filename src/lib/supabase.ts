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

export interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  bio: string;
  avatar_url: string | null;
  banner_url: string | null;
  location: string | null;
  website: string | null;
  privacy_level: 'public' | 'friends' | 'private';
  show_stats: boolean;
  show_achievements: boolean;
  show_activities: boolean;
  is_online: boolean;
  last_seen: string;
  created_at: string;
  updated_at: string;
}

export interface Friendship {
  id: string;
  user_id: string;
  friend_id: string;
  status: 'active' | 'blocked';
  created_at: string;
}

export interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: 'pending' | 'accepted' | 'declined';
  message: string;
  created_at: string;
  updated_at: string;
}

export interface UserBadge {
  id: string;
  user_id: string;
  badge_type: string;
  badge_name: string;
  badge_description: string;
  badge_icon: string;
  badge_color: string;
  is_equipped: boolean;
  earned_at: string;
}

export interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  post_type: 'status' | 'achievement' | 'level_up' | 'milestone';
  metadata: Record<string, any>;
  privacy_level: 'public' | 'friends' | 'private';
  likes_count: number;
  comments_count: number;
  created_at: string;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface SharedAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_data: Record<string, any>;
  shared_with: 'public' | 'friends';
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  level: number;
  total_xp: number;
  total_stats: number;
  completed_tasks: number;
  competitions_won: number;
  xp_rank: number;
  level_rank: number;
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