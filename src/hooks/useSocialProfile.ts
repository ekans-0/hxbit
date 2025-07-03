import { useState, useEffect } from 'react';
import { supabase, type User, type UserProfile } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface ProfileWithStats extends User {
  profile: UserProfile & {
    followers_count: number;
    following_count: number;
    profile_picture_url?: string;
  };
  user_stats: any;
  is_following: boolean;
  is_followed_by: boolean;
}

export function useSocialProfile(userId: string | undefined) {
  const [profiles, setProfiles] = useState<ProfileWithStats[]>([]);
  const [currentProfile, setCurrentProfile] = useState<ProfileWithStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProfile(userId);
    }
  }, [userId]);

  const fetchProfile = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(*),
          user_stats(*)
        `)
        .eq('id', targetUserId)
        .single();

      if (error) throw error;

      // Check if current user is following this profile
      const { data: followData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', userId)
        .eq('following_id', targetUserId)
        .maybeSingle();

      // Check if this profile is following current user
      const { data: followedByData } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', targetUserId)
        .eq('following_id', userId)
        .maybeSingle();

      const profileWithStats: ProfileWithStats = {
        ...data,
        is_following: !!followData,
        is_followed_by: !!followedByData,
      };

      setCurrentProfile(profileWithStats);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(*),
          user_stats(*)
        `)
        .ilike('username', `%${query}%`)
        .neq('id', userId)
        .limit(20);

      if (error) throw error;

      // Check follow status for each user
      const usersWithFollowStatus = await Promise.all(
        (data || []).map(async (user) => {
          const { data: followData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', userId)
            .eq('following_id', user.id)
            .maybeSingle();

          const { data: followedByData } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', userId)
            .maybeSingle();

          return {
            ...user,
            is_following: !!followData,
            is_followed_by: !!followedByData,
          };
        })
      );

      setProfiles(usersWithFollowStatus);
      return usersWithFollowStatus;
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      return [];
    }
  };

  const followUser = async (targetUsername: string) => {
    try {
      const { error } = await supabase.rpc('follow_user', {
        target_username: targetUsername,
      });

      if (error) throw error;
      
      toast.success('Now following user');
      
      // Refresh profiles
      if (currentProfile) {
        await fetchProfile(currentProfile.id);
      }
    } catch (error: any) {
      console.error('Error following user:', error);
      toast.error(error.message || 'Failed to follow user');
    }
  };

  const unfollowUser = async (targetUsername: string) => {
    try {
      const { error } = await supabase.rpc('unfollow_user', {
        target_username: targetUsername,
      });

      if (error) throw error;
      
      toast.success('Unfollowed user');
      
      // Refresh profiles
      if (currentProfile) {
        await fetchProfile(currentProfile.id);
      }
    } catch (error: any) {
      console.error('Error unfollowing user:', error);
      toast.error(error.message || 'Failed to unfollow user');
    }
  };

  const uploadProfilePicture = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `profile-pictures/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new picture URL
      const { error: updateError } = await supabase
        .from('user_profiles')
        .update({ profile_picture_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      toast.success('Profile picture updated!');
      
      if (currentProfile) {
        await fetchProfile(currentProfile.id);
      }
    } catch (error: any) {
      console.error('Error uploading profile picture:', error);
      toast.error(error.message || 'Failed to upload profile picture');
    }
  };

  const getFollowers = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          follower:users!follows_follower_id_fkey(
            *,
            profile:user_profiles(*)
          )
        `)
        .eq('following_id', targetUserId);

      if (error) throw error;
      return data?.map(f => f.follower) || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      return [];
    }
  };

  const getFollowing = async (targetUserId: string) => {
    try {
      const { data, error } = await supabase
        .from('follows')
        .select(`
          following:users!follows_following_id_fkey(
            *,
            profile:user_profiles(*)
          )
        `)
        .eq('follower_id', targetUserId);

      if (error) throw error;
      return data?.map(f => f.following) || [];
    } catch (error) {
      console.error('Error fetching following:', error);
      return [];
    }
  };

  return {
    profiles,
    currentProfile,
    loading,
    searchUsers,
    followUser,
    unfollowUser,
    uploadProfilePicture,
    getFollowers,
    getFollowing,
    fetchProfile,
  };
}