import { useState, useEffect } from 'react';
import { supabase, type Task } from '../lib/supabase';
import toast from 'react-hot-toast';

export function useTasks(userId: string | undefined, extracurricularId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, extracurricularId]);

  const fetchTasks = async () => {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId);

      if (extracurricularId) {
        query = query.eq('extracurricular_id', extracurricularId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (task: Omit<Task, 'id' | 'user_id' | 'completed' | 'completed_at' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            ...task,
            user_id: userId,
            completed: false,
            completed_at: null,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      setTasks(prev => [data, ...prev]);
      toast.success('Task created!');
      return data;
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  };

  const completeTask = async (taskId: string, xpReward: number, extracurricularId: string) => {
    try {
      // Update task as completed
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Update extracurricular XP
      const { data: extracurricular, error: extracurricularError } = await supabase
        .from('extracurriculars')
        .select('xp, level')
        .eq('id', extracurricularId)
        .single();

      if (extracurricularError) throw extracurricularError;

      const newXp = extracurricular.xp + xpReward;
      const newLevel = Math.floor(newXp / 100) + 1; // 100 XP per level

      const { error: updateExtracurricularError } = await supabase
        .from('extracurriculars')
        .update({ xp: newXp, level: newLevel })
        .eq('id', extracurricularId);

      if (updateExtracurricularError) throw updateExtracurricularError;

      // Update user total XP and level
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('total_xp, level')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      const newTotalXp = user.total_xp + xpReward;
      const newUserLevel = Math.floor(newTotalXp / 500) + 1; // 500 XP per user level

      const { error: updateUserError } = await supabase
        .from('users')
        .update({ total_xp: newTotalXp, level: newUserLevel })
        .eq('id', userId);

      if (updateUserError) throw updateUserError;

      // Update local state
      setTasks(prev => prev.map(t => 
        t.id === taskId 
          ? { ...t, completed: true, completed_at: new Date().toISOString() }
          : t
      ));

      toast.success(`Task completed! +${xpReward} XP`, {
        icon: '🎉',
        style: {
          background: '#1F2937',
          color: '#00D4FF',
          border: '1px solid #00D4FF',
        },
      });

      if (newLevel > extracurricular.level) {
        toast.success(`Level up! ${extracurricular.level} → ${newLevel}`, {
          icon: '⭐',
          duration: 4000,
          style: {
            background: '#1F2937',
            color: '#F59E0B',
            border: '1px solid #F59E0B',
          },
        });
      }

      return { newXp, newLevel, newTotalXp, newUserLevel };
    } catch (error) {
      console.error('Error completing task:', error);
      toast.error('Failed to complete task');
      throw error;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  };

  return {
    tasks,
    loading,
    createTask,
    completeTask,
    deleteTask,
    refetch: fetchTasks,
  };
}