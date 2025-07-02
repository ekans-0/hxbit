import { useState, useEffect } from 'react';
import { supabase, type Friendship, type FriendRequest, type User, type UserProfile } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface FriendWithProfile extends User {
  profile: UserProfile;
  friendship: Friendship;
}

export interface FriendRequestWithProfile extends FriendRequest {
  sender: User & { profile: UserProfile };
  receiver: User & { profile: UserProfile };
}

export function useFriends(userId: string | undefined) {
  const [friends, setFriends] = useState<FriendWithProfile[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequestWithProfile[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequestWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchFriends();
      fetchFriendRequests();
    }
  }, [userId]);

  const fetchFriends = async () => {
    try {
      const { data, error } = await supabase
        .from('friendships')
        .select(`
          *,
          friend:users!friendships_friend_id_fkey(
            *,
            profile:user_profiles(*)
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;
      
      const friendsWithProfiles = data?.map(friendship => ({
        ...friendship.friend,
        profile: friendship.friend.profile,
        friendship: {
          id: friendship.id,
          user_id: friendship.user_id,
          friend_id: friendship.friend_id,
          status: friendship.status,
          created_at: friendship.created_at,
        },
      })) || [];

      setFriends(friendsWithProfiles);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      // Received requests
      const { data: receivedData, error: receivedError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          sender:users!friend_requests_sender_id_fkey(
            *,
            profile:user_profiles(*)
          )
        `)
        .eq('receiver_id', userId)
        .eq('status', 'pending');

      if (receivedError) throw receivedError;

      // Sent requests
      const { data: sentData, error: sentError } = await supabase
        .from('friend_requests')
        .select(`
          *,
          receiver:users!friend_requests_receiver_id_fkey(
            *,
            profile:user_profiles(*)
          )
        `)
        .eq('sender_id', userId)
        .eq('status', 'pending');

      if (sentError) throw sentError;

      const receivedWithProfiles = receivedData?.map(request => ({
        ...request,
        sender: {
          ...request.sender,
          profile: request.sender.profile,
        },
        receiver: null as any,
      })) || [];

      const sentWithProfiles = sentData?.map(request => ({
        ...request,
        sender: null as any,
        receiver: {
          ...request.receiver,
          profile: request.receiver.profile,
        },
      })) || [];

      setFriendRequests(receivedWithProfiles);
      setSentRequests(sentWithProfiles);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
      toast.error('Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (username: string, message: string = '') => {
    try {
      const { data, error } = await supabase.rpc('send_friend_request', {
        receiver_username: username,
        message: message,
      });

      if (error) throw error;
      
      toast.success('Friend request sent!');
      await fetchFriendRequests();
      return data;
    } catch (error: any) {
      console.error('Error sending friend request:', error);
      toast.error(error.message || 'Failed to send friend request');
      throw error;
    }
  };

  const acceptFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase.rpc('accept_friend_request', {
        request_id: requestId,
      });

      if (error) throw error;
      
      toast.success('Friend request accepted!');
      await fetchFriends();
      await fetchFriendRequests();
    } catch (error: any) {
      console.error('Error accepting friend request:', error);
      toast.error(error.message || 'Failed to accept friend request');
      throw error;
    }
  };

  const declineFriendRequest = async (requestId: string) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined', updated_at: new Date().toISOString() })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success('Friend request declined');
      await fetchFriendRequests();
    } catch (error) {
      console.error('Error declining friend request:', error);
      toast.error('Failed to decline friend request');
      throw error;
    }
  };

  const removeFriend = async (friendId: string) => {
    try {
      const { error } = await supabase
        .from('friendships')
        .delete()
        .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);

      if (error) throw error;
      
      toast.success('Friend removed');
      await fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
      throw error;
    }
  };

  const searchUsers = async (query: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          profile:user_profiles(*)
        `)
        .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
        .neq('id', userId)
        .limit(10);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
      return [];
    }
  };

  return {
    friends,
    friendRequests,
    sentRequests,
    loading,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUsers,
    refetch: () => {
      fetchFriends();
      fetchFriendRequests();
    },
  };
}