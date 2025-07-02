import { useState, useEffect } from 'react';
import { supabase, type UserProfile, type User } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create initial profile if it doesn't exist
        await createInitialProfile();
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const createInitialProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            user_id: userId,
            display_name: null,
            bio: '',
            privacy_level: 'friends',
            show_stats: true,
            show_achievements: true,
            show_activities: true,
            is_online: true,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error creating initial profile:', error);
      toast.error('Failed to create profile');
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      toast.success('Profile updated successfully!');
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const updateOnlineStatus = async (isOnline: boolean) => {
    try {
      await supabase
        .from('user_profiles')
        .update({
          is_online: isOnline,
          last_seen: new Date().toISOString(),
        })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Error updating online status:', error);
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    updateOnlineStatus,
    refetch: fetchProfile,
  };
}