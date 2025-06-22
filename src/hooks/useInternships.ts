import { useState, useEffect } from 'react';
import { supabase, type Internship } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useInternships(userId: string | undefined, extracurricularId?: string) {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchInternships();
    }
  }, [userId, extracurricularId]);

  const fetchInternships = async () => {
    try {
      let query = supabase
        .from('internships')
        .select('*')
        .eq('user_id', userId);

      if (extracurricularId) {
        query = query.eq('extracurricular_id', extracurricularId);
      }

      const { data, error } = await query.order('start_date', { ascending: false });

      if (error) throw error;
      setInternships(data || []);
    } catch (error) {
      console.error('Error fetching internships:', error);
      toast.error('Failed to load internships');
    } finally {
      setLoading(false);
    }
  };

  const createInternship = async (internship: Omit<Internship, 'id' | 'user_id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .insert([
          {
            ...internship,
            user_id: userId,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setInternships(prev => [data, ...prev]);
      toast.success('Internship added!');
      return data;
    } catch (error) {
      console.error('Error creating internship:', error);
      toast.error('Failed to add internship');
      throw error;
    }
  };

  const deleteInternship = async (id: string) => {
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInternships(prev => prev.filter(i => i.id !== id));
      toast.success('Internship deleted');
    } catch (error) {
      console.error('Error deleting internship:', error);
      toast.error('Failed to delete internship');
      throw error;
    }
  };

  return {
    internships,
    loading,
    createInternship,
    deleteInternship,
    refetch: fetchInternships,
  };
}