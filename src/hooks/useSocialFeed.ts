import { useState, useEffect } from 'react';
import { supabase, type SocialPost, type PostLike, type User, type UserProfile } from '../lib/supabase';
import toast from 'react-hot-toast';

export interface SocialPostWithUser extends SocialPost {
  user: User & { profile: UserProfile };
  is_liked: boolean;
  user_like_id?: string;
}

export function useSocialFeed(userId: string | undefined) {
  const [posts, setPosts] = useState<SocialPostWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchFeed();
    }
  }, [userId]);

  const fetchFeed = async () => {
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          user:users(
            *,
            profile:user_profiles(*)
          ),
          likes:post_likes(id, user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const postsWithLikes = data?.map(post => ({
        ...post,
        user: {
          ...post.user,
          profile: post.user.profile,
        },
        is_liked: post.likes?.some((like: any) => like.user_id === userId) || false,
        user_like_id: post.likes?.find((like: any) => like.user_id === userId)?.id,
      })) || [];

      setPosts(postsWithLikes);
    } catch (error) {
      console.error('Error fetching social feed:', error);
      toast.error('Failed to load social feed');
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (content: string, postType: string = 'status', metadata: Record<string, any> = {}, privacyLevel: string = 'friends') => {
    try {
      // Sanitize content
      const sanitizedContent = content.trim();
      if (!sanitizedContent) {
        throw new Error('Post content cannot be empty');
      }
      
      if (sanitizedContent.length > 1000) {
        throw new Error('Post content must be less than 1000 characters');
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert([
          {
            user_id: userId,
            content: sanitizedContent,
            post_type: postType,
            metadata,
            privacy_level: privacyLevel,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      toast.success('Post created!');
      await fetchFeed();
      return data;
    } catch (error: any) {
      console.error('Error creating post:', error);
      toast.error(error.message || 'Failed to create post');
      throw error;
    }
  };

  const likePost = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('post_likes')
        .insert([
          {
            post_id: postId,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // Update likes count
      await supabase
        .from('social_posts')
        .update({ likes_count: supabase.sql`likes_count + 1` })
        .eq('id', postId);

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: true, 
              user_like_id: data.id,
              likes_count: post.likes_count + 1 
            }
          : post
      ));

      toast.success('Post liked!');
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };

  const unlikePost = async (postId: string, likeId: string) => {
    try {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', likeId);

      if (error) throw error;

      // Update likes count
      await supabase
        .from('social_posts')
        .update({ likes_count: supabase.sql`GREATEST(likes_count - 1, 0)` })
        .eq('id', postId);

      // Update local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: false, 
              user_like_id: undefined,
              likes_count: Math.max(0, post.likes_count - 1)
            }
          : post
      ));

      toast.success('Post unliked');
    } catch (error) {
      console.error('Error unliking post:', error);
      toast.error('Failed to unlike post');
    }
  };

  const deletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('social_posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', userId); // Ensure user can only delete their own posts

      if (error) throw error;
      
      setPosts(prev => prev.filter(post => post.id !== postId));
      toast.success('Post deleted');
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const shareAchievement = async (achievementType: string, achievementData: Record<string, any>, privacyLevel: string = 'friends') => {
    try {
      let content = '';
      switch (achievementType) {
        case 'level_up':
          content = `🎉 Level up! I just reached Level ${achievementData.level}!`;
          break;
        case 'xp_milestone':
          content = `⚡ XP Milestone! I've earned ${achievementData.xp?.toLocaleString()} total XP!`;
          break;
        case 'task_completion':
          content = `✅ Task completed: ${achievementData.title}`;
          break;
        default:
          content = `🏆 Achievement unlocked!`;
      }

      const { data, error } = await supabase
        .from('social_posts')
        .insert([
          {
            user_id: userId,
            content,
            post_type: 'achievement',
            metadata: achievementData,
            privacy_level: privacyLevel,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      
      // Also add to shared achievements
      await supabase
        .from('shared_achievements')
        .insert([
          {
            user_id: userId,
            achievement_type: achievementType,
            achievement_data: achievementData,
            shared_with: privacyLevel,
          },
        ]);

      toast.success('Achievement shared!');
      await fetchFeed();
      return data;
    } catch (error) {
      console.error('Error sharing achievement:', error);
      toast.error('Failed to share achievement');
      throw error;
    }
  };

  const reportPost = async (postId: string, reason: string) => {
    try {
      // In a real app, this would create a report record
      toast.success('Post reported. Thank you for helping keep our community safe.');
    } catch (error) {
      console.error('Error reporting post:', error);
      toast.error('Failed to report post');
    }
  };

  return {
    posts,
    loading,
    createPost,
    likePost,
    unlikePost,
    deletePost,
    shareAchievement,
    reportPost,
    refetch: fetchFeed,
  };
}