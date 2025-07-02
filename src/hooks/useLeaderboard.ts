import { useState, useEffect } from 'react';
import { supabase, type LeaderboardEntry } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useLeaderboard(userId: string | undefined) {
  const [globalLeaderboard, setGlobalLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [friendsLeaderboard, setFriendsLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchLeaderboards();
    }
  }, [userId]);

  const fetchLeaderboards = async () => {
    try {
      // Fetch global leaderboard
      const { data: globalData, error: globalError } = await supabase
        .from('global_leaderboards')
        .select('*')
        .limit(100);

      if (globalError) throw globalError;

      // Fetch friends leaderboard
      const { data: friendsData, error: friendsError } = await supabase
        .from('global_leaderboards')
        .select('*')
        .in('id', [
          userId,
          ...(await getFriendIds())
        ])
        .order('total_xp', { ascending: false });

      if (friendsError) throw friendsError;

      // Find user's rank
      const userRankData = globalData?.find(entry => entry.id === userId);

      setGlobalLeaderboard(globalData || []);
      setFriendsLeaderboard(friendsData || []);
      setUserRank(userRankData || null);
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
      toast.error('Failed to load leaderboards');
    } finally {
      setLoading(false);
    }
  };

  const getFriendIds = async (): Promise<string[]> => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select('friend_id')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;
      return data?.map(f => f.friend_id) || [];
    } catch (error) {
      console.error('Error fetching friend IDs:', error);
      return [];
    }
  };

  const getLeaderboardByCategory = async (category: 'xp' | 'level' | 'tasks' | 'competitions') => {
    try {
      let orderBy = 'total_xp';
      switch (category) {
        case 'level':
          orderBy = 'level';
          break;
        case 'tasks':
          orderBy = 'completed_tasks';
          break;
        case 'competitions':
          orderBy = 'competitions_won';
          break;
      }

      const { data, error } = await supabase
        .from('global_leaderboards')
        .select('*')
        .order(orderBy, { ascending: false })
        .limit(50);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching category leaderboard:', error);
      toast.error('Failed to load leaderboard');
      return [];
    }
  };

  return {
    globalLeaderboard,
    friendsLeaderboard,
    userRank,
    loading,
    getLeaderboardByCategory,
    refetch: fetchLeaderboards,
  };
}