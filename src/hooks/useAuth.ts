import { useState, useEffect } from 'react';
import { supabase, type User } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
      // Sanitize username
      const sanitizedUsername = username.trim().toLowerCase();
      
      // Validate username format
      if (!/^[a-zA-Z0-9_]{3,20}$/.test(sanitizedUsername)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      }

      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('username', sanitizedUsername)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      
      return !data; // Returns true if username is available
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    }
  };

  const signUp = async (email: string, password: string, username: string) => {
    try {
      // Validate inputs
      if (!email || !password || !username) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Check username availability
      const isUsernameAvailable = await checkUsernameAvailability(username);
      if (!isUsernameAvailable) {
        throw new Error('Username is already taken');
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile
        const { error: profileError } = await supabase
          .from('users')
          .insert([
            {
              id: data.user.id,
              email: data.user.email!,
              username: username.trim().toLowerCase(),
              level: 1,
              total_xp: 0,
            },
          ]);

        if (profileError) throw profileError;
      }

      return data;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  return {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    checkUsernameAvailability,
  };
}