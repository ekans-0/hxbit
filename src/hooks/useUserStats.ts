import { useState, useEffect } from 'react';
import { supabase, type UserStats } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useUserStats(userId: string | undefined) {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserStats();
    }
  }, [userId]);

  const fetchUserStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (!data) {
        // Create initial stats if they don't exist
        await createInitialStats();
      } else {
        setUserStats(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      toast.error('Failed to load user stats');
    } finally {
      setLoading(false);
    }
  };

  const createInitialStats = async () => {
    try {
      const { data, error } = await supabase
        .from('user_stats')
        .insert([
          {
            user_id: userId,
            strength: 10,
            agility: 10,
            intelligence: 10,
            vitality: 10,
            sense: 10,
            charisma: 10,
            luck: 10,
            endurance: 10,
            hygiene: 10,
            perception: 10,
            stat_points: 5,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setUserStats(data);
    } catch (error) {
      console.error('Error creating initial stats:', error);
      toast.error('Failed to create user stats');
    }
  };

  const upgradeStat = async (statName: keyof Omit<UserStats, 'id' | 'user_id' | 'stat_points' | 'created_at' | 'updated_at'>) => {
    if (!userStats || userStats.stat_points <= 0) return;

    try {
      const newStatValue = userStats[statName] + 1;
      const newStatPoints = userStats.stat_points - 1;

      const { data, error } = await supabase
        .from('user_stats')
        .update({
          [statName]: newStatValue,
          stat_points: newStatPoints,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setUserStats(data);
      
      toast.success(`${statName.charAt(0).toUpperCase() + statName.slice(1)} increased to ${newStatValue}!`, {
        icon: '⬆️',
        style: {
          background: '#1F2937',
          color: '#00D4FF',
          border: '1px solid #00D4FF',
        },
      });
    } catch (error) {
      console.error('Error upgrading stat:', error);
      toast.error('Failed to upgrade stat');
    }
  };

  const awardStatPoints = async (points: number) => {
    if (!userStats) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update({
          stat_points: userStats.stat_points + points,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      setUserStats(data);
      
      toast.success(`Earned ${points} stat points!`, {
        icon: '🌟',
        style: {
          background: '#1F2937',
          color: '#F59E0B',
          border: '1px solid #F59E0B',
        },
      });
    } catch (error) {
      console.error('Error awarding stat points:', error);
    }
  };

  return {
    userStats,
    loading,
    upgradeStat,
    awardStatPoints,
    refetch: fetchUserStats,
  };
}