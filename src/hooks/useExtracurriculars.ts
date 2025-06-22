import { useState, useEffect } from 'react';
import { supabase, type Extracurricular } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useExtracurriculars(userId: string | undefined) {
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchExtracurriculars();
    }
  }, [userId]);

  const fetchExtracurriculars = async () => {
    try {
      const { data, error } = await supabase
        .from('extracurriculars')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtracurriculars(data || []);
    } catch (error) {
      console.error('Error fetching extracurriculars:', error);
      toast.error('Failed to load extracurriculars');
    } finally {
      setLoading(false);
    }
  };

  const createExtracurricular = async (extracurricular: Omit<Extracurricular, 'id' | 'user_id' | 'level' | 'xp' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('extracurriculars')
        .insert([
          {
            ...extracurricular,
            user_id: userId,
            level: 1,
            xp: 0,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setExtracurriculars(prev => [data, ...prev]);
      toast.success('Extracurricular created!');
      return data;
    } catch (error) {
      console.error('Error creating extracurricular:', error);
      toast.error('Failed to create extracurricular');
      throw error;
    }
  };

  const updateExtracurricular = async (id: string, updates: Partial<Extracurricular>) => {
    try {
      const { data, error } = await supabase
        .from('extracurriculars')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      setExtracurriculars(prev => prev.map(e => e.id === id ? data : e));
      return data;
    } catch (error) {
      console.error('Error updating extracurricular:', error);
      toast.error('Failed to update extracurricular');
      throw error;
    }
  };

  const deleteExtracurricular = async (id: string) => {
    try {
      const { error } = await supabase
        .from('extracurriculars')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setExtracurriculars(prev => prev.filter(e => e.id !== id));
      toast.success('Extracurricular deleted');
    } catch (error) {
      console.error('Error deleting extracurricular:', error);
      toast.error('Failed to delete extracurricular');
      throw error;
    }
  };

  return {
    extracurriculars,
    loading,
    createExtracurricular,
    updateExtracurricular,
    deleteExtracurricular,
    refetch: fetchExtracurriculars,
  };
}