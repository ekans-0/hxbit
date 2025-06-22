import { useState, useEffect } from 'react';
import { supabase, type Competition } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useCompetitions(userId: string | undefined, extracurricularId?: string) {
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchCompetitions();
    }
  }, [userId, extracurricularId]);

  const fetchCompetitions = async () => {
    try {
      let query = supabase
        .from('competitions')
        .select('*')
        .eq('user_id', userId);

      if (extracurricularId) {
        query = query.eq('extracurricular_id', extracurricularId);
      }

      const { data, error } = await query.order('date', { ascending: false });

      if (error) throw error;
      setCompetitions(data || []);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('Failed to load competitions');
    } finally {
      setLoading(false);
    }
  };

  const createCompetition = async (competition: Omit<Competition, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('competitions')
        .insert([
          {
            ...competition,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setCompetitions(prev => [data, ...prev]);
      toast.success('Competition added!');
      return data;
    } catch (error) {
      console.error('Error creating competition:', error);
      toast.error('Failed to add competition');
      throw error;
    }
  };

  const deleteCompetition = async (id: string) => {
    try {
      const { error } = await supabase
        .from('competitions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCompetitions(prev => prev.filter(c => c.id !== id));
      toast.success('Competition deleted');
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('Failed to delete competition');
      throw error;
    }
  };

  return {
    competitions,
    loading,
    createCompetition,
    deleteCompetition,
    refetch: fetchCompetitions,
  };
}